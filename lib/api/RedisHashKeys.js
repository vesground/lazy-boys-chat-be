export default RedisKeys = {
  create() {
    return;
  },

  keys: {
    USER: {
      userDetails: generateRedisKey('users', 'name') // , data.name)
    }

  }
}
