const Joi = require('@hapi/joi')


function validate(params = {}, schema = {}) {
  const ctx = this
  let _schema = Joi.object(schema)
  let validator = _schema.validate(params)
  // const validator = Joi.validate(params, Joi.object().keys(schema), {allowUnknown: true})
  if (validator.error) {
    ctx.throw(400, validator.error.message)
    return false
  }
  return true
}

module.exports = {
  validate
}