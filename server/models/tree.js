const moment = require('moment')

module.exports = (sequelize, dataTypes) => {
  let Tree = sequelize.define('tree', {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    name: dataTypes.STRING(100),
    parentId: {type: dataTypes.INTEGER(11)},
    status: {type: dataTypes.BOOLEAN, defaultValue: true}, // 默认启用
    createdAt: {
      type: dataTypes.DATE,
      defaultValue: dataTypes.NOW,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updatedAt: {
      type: dataTypes.DATE,
      defaultValue: dataTypes.NOW,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  })

  Tree.associate = models => {
    Tree.hasMany(models.article)
  }
  return Tree
}

