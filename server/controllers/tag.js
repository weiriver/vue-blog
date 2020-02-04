const {tag: TagModel, category: CategoryModel, sequelize, article: ArticleModel} = require('../models')
const Joi = require('@hapi/joi')

class TagController {
  static async getTagList(ctx) {
    // let data = await TagModel.findAll({
    //   attributes: [['name', 'tagName']]
    // })
    const data = await TagModel.findAll({
      // where: {
      //   articleId: {
      //     $not: null
      //   }
      // },
      attributes: [
        'name',
        [
          sequelize.fn('COUNT', sequelize.col('name')),
          'count'
        ]
      ],
      group: 'name'
    })

    ctx.body = data
  }

  static async getCategoryList(ctx) {
    const validator = ctx.validate(ctx.query, {
      status: [Joi.boolean(), Joi.string()],
      isdraft: [Joi.boolean(), Joi.string()]
    })
    if (validator) {
      let {status = 'all', isdraft = 'all'} = ctx.query
      let query = {}
      if (status !== 'all') {
        query.status = status === 'true'
      }
      if (isdraft !== 'all') {
        query.isdraft = isdraft === 'true'
      }
      const data = await CategoryModel.findAll({
        where: {
          articleId: {
            $not: null
          }
        },
        include: [
          {
            as: 'article',
            model: ArticleModel,
            // attributes: ['id'],
            where: {
              isdraft: false,
              status: true
            }
          }
        ],
        attributes: [
          'name',
          [
            sequelize.fn('COUNT', sequelize.col('name')),
            'count'
          ]
        ],
        group: 'name'
      })

      ctx.body = data
    }
  }
}

module.exports = TagController
