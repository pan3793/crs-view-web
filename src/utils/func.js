export function parseJSON (str) {
  if (str === undefined || str == null || str.length === 0) {
    return null
  }
  try {
    return JSON.parse(str)
  } catch (err) {
    console.error('parseJSON异常', err)
    return null
  }
}

export function isBlank (str, chars = this._.whitespace) {
  return this._.trim(str, chars).length === 0
}
