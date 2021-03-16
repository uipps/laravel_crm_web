export default {
  set: (value) => {
    let token = `${value}:${Date.now()}`
    window.localStorage.setItem('authorization', token)
  },
  get: () => {
    let token = window.localStorage.getItem('authorization')
    if (token) {
      token = token.split(':')
      return token.length === 2 && token[0]
    }
    return null
  }
}