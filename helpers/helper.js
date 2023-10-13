function isKeyFilled(key) {
  return key !== undefined && typeof key === 'string' && key.trim() !== '';
}


module.exports = {
  isKeyFilled
}