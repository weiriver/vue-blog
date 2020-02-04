module.exports = (sequelize, dataTypes) => {

  const Category = sequelize.define('category', {
    id: {type: dataTypes.INTEGER(11), primaryKey: true, autoIncrement: true},
    name: {type: dataTypes.STRING(100), allowNull: false}
  }, {timestamps: true})

  Category.associate = models => {
    Category.belongsTo(models.article, {
      as: 'article',
      foreignKey: 'articleId',
      targetId: 'id',
      constraints: false
    })
  }

  return Category
}
