const Joi = require('@hapi/joi')
const {sequelize} = require('../models')
const PDFParser = require('pdf2json')
const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  user: UserModel,
  comment: CommentModel,
  reply: ReplyModel
} = require('../models')
const send = require('koa-send')
const archiver = require('archiver') // 打包 zip
const fs = require('fs')
const path = require('path')

const {generateFile, findOrCreateFilePath, uploadPath, outputPath} = require('../utils/file')


class ArticleController {

  // 初始化数据 关于页面（用于评论关联）
  static async initAboutPage(ctx) {
    const result = await ArticleModel.findOne({where: {id: -1}})
    if (!result) {
      await ArticleModel.create({
        id: -1,
        title: '关于页面',
        content: '关于页面存档，勿删'
      })
      console.log('关于页面创建完毕')
    } else {
      console.log('关于页面已经存在')
    }
  }

  // 创建文章
  static async create(ctx) {
    // title, content, viewCount,
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number().required(),
      title: Joi.string().required(),
      treeId: Joi.number().required(),
      content: Joi.string().required(),
      categoryList: Joi.array(),
      tagList: Joi.array()
    })
    if (validator) {
      const {authorId, title, content, categoryList, tagList, treeId} = ctx.request.body
      const result = await ArticleModel.findOne({where: {title}})
      if (result) {
        ctx.throw(403, '创建失败, 该文章已经存在')
      } else {
        const tags = tagList.map(t => ({name: t}))
        const categories = categoryList.map(c => ({name: c}))
        const data = await ArticleModel.create(
          {authorId, title, content, categories, tags, treeId},
          {include: [TagModel, CategoryModel]}
        )
        ctx.body = {
          code: 0,
          data
        }
      }
    }
  }

  // 解析有道云文章
  static async createBlogFromYoudao(ctx) {

    let blogsPath = path.resolve(__dirname, '../../blogs')

    let pdfParser = new PDFParser(this, 1)

    function analysisDirectory(targetPath) {
      // return new Promise((resolve, reject) => {
      // })
      let arr = fs.readdirSync(targetPath)
      arr.forEach(async v => {
        let target = path.resolve(targetPath, v)
        var stat = fs.lstatSync(target)
        var is_direc = stat.isDirectory() // true || false 判断是不是文件夹
        if (!is_direc) { // 是文件
          if (/\.pdf$/.test(v)) {
            decodePdf(target)
          } else if (/\.md$/.test(v)) {
            await decodeMd(target, v, target)
          }
        } else { // 文件夹
          analysisDirectory(target)
        }
      })
    }

    analysisDirectory(blogsPath)

    function decodePdf(target) {
      // pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError))
      // pdfParser.on('pdfParser_dataReady', pdfData => {
      //   // fs.writeFile('./pdf2json/test/F1040EZ.json', JSON.stringify(pdfData))
      //   // console.log(pdfData.formImage.Pages[0].Texts)
      //   // console.log(JSON.stringify(Object.keys(pdfParser)))
      //   // fs.writeFileSync('./pdf.txt', pdfParser.getRawTextContent())
      // })
      //
      // pdfParser.loadPDF(target)
    }

    async function decodeMd(target, name, fullPath) {
      let path = fullPath.replace('D:\\delete\\vue-blog\\blogs\\', '')
      let arr = path.split('\\')
      let newArr = arr.splice(0, arr.length - 1)
      let fileName = name
      let categoryList = newArr.map(v => {
        if (/^(\d{1,2}\.)/g.test(v)) {
          v = v.substr(3, v.length - 3)
          return v
        }
        return v
      })
      if (/^(\d{1,2}\.)/g.test(fileName)) {
        fileName = fileName.substr(3, fileName.length - 3).trim()
      }

      let title = fileName
      let authorId = 1
      let content = fs.readFileSync(target, 'utf-8')
      const result = await ArticleModel.findOne({where: {title}})
      if (result) {
        ctx.throw(403, '创建失败, 该文章已经存在')
      } else {
        // const tags = tagList.map(t => ({name: t}))
        const tags = [{name: '有道'}]
        const categories = categoryList.map(c => ({name: c}))
        const data = await ArticleModel.create(
          {authorId, title, content, categories, tags},
          {include: [TagModel, CategoryModel]}
        )
        console.log('文件名是-', fileName, '标签是-', newArr)
      }
    }

    ctx.body = {code: 0}
  }

  // 文章列表
  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      page: Joi.string(),
      pageSize: Joi.number(),
      keyword: Joi.string(), // 关键字查询
      category: Joi.string(),
      tag: Joi.string(),
      preview: Joi.number(),
      order: Joi.string(),
      total: Joi.number(),
      status: [Joi.boolean(), Joi.string()],
      isdraft: [Joi.boolean(), Joi.string()]
    })
    if (validator) {
      let {page = 1, pageSize = 10, keyword = '', preview = 1, category, tag, order, status = 'all', isdraft = 'all'} = ctx.query
      const tagFilter = tag ? {name: tag} : null
      const categoryFilter = category ? {name: category} : null
      let articleOrder = [['createdAt', 'DESC']] // 倒序序使用
      // let articleOrder = [['createdAt', 'ASC']] // 升序排序使用
      if (order) {
        articleOrder = [order.split(' ')] // 排序使用
      }
      let query = {
        id: {$not: -1},
        $or: {
          title: {$like: `%${keyword}%`},
          content: {$like: `%${keyword}%`}
        }
      }
      if (status !== 'all') {
        query.status = status === 'true'
      }
      if (isdraft !== 'all') {
        query.isdraft = isdraft === 'true'
      }

      const data = await ArticleModel.findAndCountAll({
        where: query,
        include: [
          {model: TagModel, attributes: ['name'], where: tagFilter},
          {model: CategoryModel, attributes: ['name'], where: categoryFilter},
          {
            model: CommentModel,
            attributes: ['id'],
            include: [{model: ReplyModel, attributes: ['id']}]
          }
        ],
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        order: articleOrder,
        row: true,
        distinct: true // count 计算
      })

      if (preview === 1) {
        data.rows.forEach(d => {
          d.content = d.content.slice(0, 1000) // 只是获取预览，减少打了的数据传输。。。
        })
      }
      ctx.body = data

    }
  }

  // 修改文章
  static async update(ctx) {
    const validator = ctx.validate(
      {
        articleId: ctx.params.id,
        ...ctx.request.body
      },
      {
        articleId: Joi.number().required(),
        title: Joi.string().required(),
        treeId: Joi.number().required(),
        content: Joi.string().required(),
        categories: Joi.array(),
        tags: Joi.array(),
        status: Joi.boolean(),
        isdraft: Joi.boolean()
      })

    if (validator) {
      const articleId = ctx.params.id
      const {title, content, categories = [], tags = [], treeId, status, isdraft} = ctx.request.body
      console.log(status, isdraft)
      const tagList = tags.map(tag => ({name: tag, articleId}))
      const categoryList = categories.map(cate => ({name: cate, articleId}))
      await ArticleModel.update({title, content, treeId, status, isdraft}, {where: {id: articleId}})
      await TagModel.destroy({where: {articleId}})
      await TagModel.bulkCreate(tagList)
      await CategoryModel.destroy({where: {articleId}})
      await CategoryModel.bulkCreate(categoryList)
      ctx.body = {
        code: 0
      }
    }
  }

  // 删除列表
  static async delete(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required()
    })
    if (validator) {
      const articleId = ctx.params.id
      // await TagModel.destroy({where: {articleId}, force: true, truncate: true})
      await TagModel.destroy({where: {articleId}})
      await CategoryModel.destroy({where: {articleId}})
      await ArticleModel.destroy({where: {id: articleId}})
      await sequelize.query(
        // `
        //   delete article, tag, category, comment, reply
        //   from article
        //   left join comment on article.id=comment.articleId
        //   left join reply on comment.id=reply.commentId
        //   left join tag on article.id=tag.articleId
        //   left join category on article.id=category.articleId
        //   where article.id=${articleId}
        // `
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.articleId=${articleId}`
      )
      ctx.body = {
        code: 0
      }
      // ctx.status = 204

    }
  }

  // todo 获取文章详情
  static async findById(ctx) {
    const validator = ctx.validate(
      {...ctx.params, ...ctx.query},
      {
        id: Joi.number().required(),
        type: Joi.number() // type 用于区分是否增加浏览次数 1 新增浏览次数 0 不新增
      }
    )
    if (validator) {
      const data = await ArticleModel.findOne({
        where: {id: ctx.params.id},
        include: [
          // 查找 分类 标签 评论 回复...
          {model: TagModel, attributes: ['name']},
          {model: CategoryModel, attributes: ['name']},
          {
            model: CommentModel,
            attributes: ['id', 'content', 'createdAt'],
            include: [
              {model: UserModel, as: 'user', attributes: ['id', 'username', 'role', 'github']},
              {
                model: ReplyModel,
                attributes: ['id', 'userId', 'content', 'createdAt'],
                include: [{model: UserModel, as: 'user', attributes: ['id', 'username', 'role', 'github']}]
              }
            ]
          }
        ],
        order: [[CommentModel, 'createdAt', 'DESC']], // comment model order
        row: true
      })

      const {type = 1} = ctx.query
      // viewer count ++
      type === 1 && ArticleModel.update({viewCount: ++data.viewCount}, {where: {id: ctx.params.id}})

      // JSON.parse(github)
      // data.comments.forEach(comment => {
      //   comment.user.github = JSON.parse(comment.user.github)
      //   comment.replies.forEach(reply => {
      //     reply.user.github = JSON.parse(reply.user.github)
      //   })
      // })
      delete data.createdAt
      ctx.body = data
    }
  }

  // 上传文章
  static async upload(ctx) {
    const file = ctx.request.files.file // 获取上传文件
    await findOrCreateFilePath(uploadPath)

    const upload = file => {
      const reader = fs.createReadStream(file.path)
      const fileName = file.name
      const filePath = `${outputPath}/${fileName}`
      const upStream = fs.createReadStream(filePath)
      reader.pipe(upStream)
      reader.on('end', function () {
        console.log('上传成功')
      })

    }

    Array.isArray(file) ? file.forEach(it => upload(it)) : upload(file)
    ctx.status = 204
  }

  // 导出文章
  static async output(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required()
    })
    if (validator) {
      const article = await ArticleModel.findOne({
        where: {id: ctx.params.id},
        include: [
          {model: TagModel, attributes: ['name']},
          {model: CategoryModel, attributes: ['name']}
        ]
      })
      const {filePath, fileName} = await generateFile(article)
      // console.log(fileName)
      ctx.attachment(decodeURI(fileName))
      await send(ctx, fileName, {root: outputPath})
    }
  }

  // 导出文章(全部)
  static async outputAll(ctx) {
    const list = await ArticleModel.findAll({
      where: {
        id: {
          $not: -1 // 过滤关于页面的副本
        }
      },
      include: [
        // 查找 分类
        {model: TagModel, attributes: ['name']},
        {model: CategoryModel, attributes: ['name']}
      ]
    })
    await Promise.all(list.map(article => generateFile(article)))

    // 打包压缩 ...
    const zipName = 'mdFiles.zip'
    const zipStream = fs.createWriteStream(`${outputPath}/${zipName}`)
    const zip = archiver('zip')
    zip.pipe(zipStream)
    list.forEach(item => {
      zip.append(fs.createReadStream(`${outputPath}/${item.title}.md`), {
        name: `${item.title}.md` // 压缩文件名
      })
    })
    await zip.finalize()
    ctx.attachment(decodeURI(zipName))
    await send(ctx, zipName, {root: outputPath})

  }

  // todo 确认插入文章
  static async uploadConfirm(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number(),
      insertList: Joi.array(),
      updateList: Joi.array()
    })
    if (validator) {
      const {insertList, updateList, authorId} = ctx.request.body
      await findOrCreateFilePath(uploadPath) // 检查目录

      const _parseList = list => {
        return list.map(item => {
          const filePath = `${uploadPath}/${item.fileName}`
          const result = decodeFile(filePath)
          const {title, date, categories = [], tags = [], content} = result
          const data = {
            title: title || item.fileName.replace(/\.md/, ''),
            categories: categories.map(d => ({name: d, articleId: item.articleId})),
            tags: tags.map(d => ({name: d, articleId: item.articleId})),
            content,
            authorId
          }
          if (date) data.createdAt = date
          if (item.articleId) data.articleId = item.articleId
          return data
        })
      }

      const list1 = _parseList(insertList)
      const list2 = _parseList(updateList)

      // 插入文章
      const insertResultList = await Promise.all(
        list1.map(data => ArticleModel.create(data, {include: [TagModel, CategoryModel]}))
      )

      const updateResultList = await Promise.all(
        list2.map(async data => {
          const {title, content, categories = [], tags = [], articleId} = data
          await ArticleModel.update({title, content}, {where: {id: articleId}})
          await TagModel.destroy({where: {articleId}})
          await TagModel.bulkCreate(tags)
          await CategoryModel.destroy({where: {articleId}})
          await CategoryModel.bulkCreate(categories)
          return ArticleModel.findOne({where: {id: articleId}})
        })
      )

      ctx.body = {insertList: insertResultList, updateList: updateResultList}
    }
  }

  /**
   * todo 确认文章是否存在
   *
   * @response existList: 数据库中已存在有的文章（包含文章的具体内容）
   * @response noExistList: 解析 md 文件 并且返回数据库中不存在的 具体有文件名 解析后的文件标题
   */
  static async checkExist(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      fileNameList: Joi.array().required()
    })

    if (validator) {
      const {fileNameList} = ctx.request.body
      const existList = [] // 存在的文件名列表
      const noExistList = []
      const list = await Promise.all(
        fileNameList.map(async fileName => {
          const filePath = `${uploadPath}/${fileName}`
          const result = decodeFile(filePath)
          const title = result.title || fileName.replace(/\.md/, '')
          const article = await ArticleModel.findOne({where: {title}})
          if (article) {
            existList.push({fileName, articleId: article.id, title: article.title})
          } else {
            const params = {fileName, title: result.title}
            params.title ? noExistList.unshift(params) : noExistList.push(params)
          }
          return article
        })
      )

      ctx.body = {existList, noExistList}
    }
  }

}

module.exports = ArticleController
