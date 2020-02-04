const {tree: TreeModel, article: ArticleModel} = require('../models')
const Joi = require('@hapi/joi')

class TreeController {
  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      id: Joi.number(),
      includeArticle: Joi.boolean(),
      status: Joi.boolean()
    })
    if (validator) {
      let {id, includeArticle, status = null} = ctx.query
      let treeList = []
      let query = {}
      query.id = id || {$not: null}
      if (status) query.status = Boolean(status)
      if (includeArticle) {
        treeList = await TreeModel.findAll({
          where: query
          // where: {id: {$not: null}}
          // include: [
          //   {
          //     model: ArticleModel,
          //     attributes: ['title', 'id', 'viewCount', 'treeId']
          //     // attributes: {exclude: ['updatedAt', 'createdAt']},
          //     // where: {treeId: {$not: null}}
          //   }
          // ]
        })
        let articleList = await ArticleModel.findAll({
          where: {id: {$not: -1}, isdraft: false, status: true},
          attributes: ['title', 'id', 'viewCount', 'treeId']
        })
        ctx.body = {
          code: 0,
          list: treeList,
          articleList
        }
      } else {
        treeList = await TreeModel.findAll({where: query})
        ctx.body = {
          code: 0,
          list: treeList
        }
      }
    }
  }

  static async addnode(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      parentId: Joi.number().required(),
      name: Joi.string().required()
    })
    if (validator) {
      const {parentId, name} = ctx.request.body
      await TreeModel.create({parentId, name})
      ctx.body = {
        code: 0
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '请求参数有误'
      }
    }

  }

  static async updateNode(ctx) {
    const validator = ctx.validate(
      ctx.request.body,
      {
        id: Joi.number().required(),
        name: Joi.string().required(),
        status: Joi.boolean(),
        parentId: Joi.number().required()
      })

    if (validator) {
      const {id, name, status, parentId} = ctx.request.body
      await TreeModel.update({name, status, parentId}, {where: {id}})
      ctx.body = {
        code: 0
      }
    }
  }

  static async initTree(ctx) {
    await TreeModel.findOrCreate({
      where: {id: 1},
      defaults: {name: '根节点', parentId: 0, status: 1}
    })
  }

  static async del(ctx) {
    // 删除列表
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required()
    })
    if (validator) {
      const id = ctx.params.id
      await TreeModel.destroy({where: {id}})
      await ArticleModel.update({treeId: 1}, {where: {treeId: id}})

      ctx.body = {
        code: 0
      }

    }
  }
}

module.exports = TreeController
