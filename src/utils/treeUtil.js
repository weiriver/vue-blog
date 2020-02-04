/**
 * @conf childrenTag        子集合字段名，默认children
 * @conf keyMap.id          节点唯一标识字段名，默认id
 * @conf keyMap.parentId    父节点唯一标识字段名，默认parentId
 *
 * @method toSingle         树状对象转平面对象
 * @method toList           平面对象转树状对象
 */
module.exports = {
  childrenTag: 'children',
  keyMap: {id: 'id', parentId: 'parentId'},
  toSingle: function (obj) {
    if (obj instanceof Array) {
      var result = []
      for (var i in obj) {
        result.push(obj[i])
        if (obj[i][this.childrenTag]) {
          result = result.concat(this.toSingle(obj[i][this.childrenTag]))
          delete obj[i][this.childrenTag]
        }
      }
      return result
    } else if (obj instanceof Object) {
      return obj
    } else {
      throw Error('It not is a Array or Object.')
    }
  },
  toList: function (arr) {
    // 查询根节点
    var temp = this.findRootList(arr)
    return this.findChildList(temp.rootNds, temp.otherNds)
  },
  findChildList: function (rootNds, childNds) {
    for (var i in rootNds) {
      var recordIndex = []
      rootNds[i][this.childrenTag] = []
      for (var j in childNds) {
        if (childNds[j][this.keyMap.parentId] == rootNds[i][this.keyMap.id]) {
          rootNds[i][this.childrenTag].push(childNds[j])
          recordIndex.push(j)
        }
      }
      // 尽可能的删去已经使用过的对象，用来减少递归时的循环次数。
      // 这里为了不让数组长度影响循环，从大到小遍历
      for (var k = recordIndex.length - 1; k >= 0; k--) {
        childNds.splice(recordIndex[k], 1)
      }
      if (childNds.length > 0) {
        this.findChildList(rootNds[i][this.childrenTag], childNds)
      }
    }
    return rootNds
  },
  findRootList: function (arr) {
    let rootNds = []
    let otherNds = []
    for (let i = 0; i < arr.length; i++) {
      let flag = true // 是否为根节点
      for (let j = 0; j < arr.length; j++) {
        if (i != j) {
          if (arr[i][this.keyMap.parentId] == arr[j][this.keyMap.id]) {
            flag = false
            break
          }
        } else {
          continue
        }
      }
      if (flag) {
        rootNds.push(arr[i])
      } else {
        otherNds.push(arr[i])
      }
    }
    return {rootNds: rootNds, otherNds: otherNds}
  }
}
