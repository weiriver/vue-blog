const mutations = {
  SET_DATA: (state, data) => {
    const {target, content} = data
    sessionStorage.setItem(target, (typeof content == 'object') ? JSON.stringify(content) : content)
    state[target] = content
  }
}

module.exports = mutations
