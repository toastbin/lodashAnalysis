const slice = require('./slice.js')
const toInteger = require('../utils/toInteger.js')

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size = 1) {
  // 确保 size 合法 
  //  1. 大于0 
  //  2. 是整数
  size = Math.max(toInteger(size), 0)

  const length = array == null ? 0 : array.length
  // 没有array 或者 size === 0 返回空数组
  if (!length || size < 1) {
    return []
  }
  let index = 0
  let resIndex = 0
  // 
  const result = new Array(Math.ceil(length / size))

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size))
  }
  return result
}

console.log(chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], 4));

module.exports = chunk
