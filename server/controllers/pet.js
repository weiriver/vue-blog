const {pet: PetModel} = require('../models')


// let now = Date.now()
// PetModel.create({
//   id: 'g-' + now,
//   name: 'Gaffey',
//   gender: false,
//   birth: '2007-07-07',
//   createdAt: now,
//   updatedAt: now,
//   version: 0
// }).then(function (p) {
//   console.log('created.' + JSON.stringify(p));
// }).catch(function (err) {
//   console.log('failed: ' + err);
// })


class PetController {
  static async getList(ctx) {
    let list = await PetModel.findAll()
    ctx.body = {
      code: 0,
      list
    }
  }
}

module.exports = PetController