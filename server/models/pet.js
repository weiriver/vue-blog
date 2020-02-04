module.exports = (sequelize, dataTypes) => {
  let Pet = sequelize.define('pet', {
    id: {
      type: dataTypes.STRING(50),
      primaryKey: true
    },
    name: dataTypes.STRING(100),
    gender: dataTypes.BOOLEAN,
    birth: dataTypes.STRING(10),
    createdAt: dataTypes.BIGINT,
    updatedAt: dataTypes.BIGINT,
    version: dataTypes.BIGINT
  })

  return Pet
}

