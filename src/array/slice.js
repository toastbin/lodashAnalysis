/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position. A negative index will be treated as an offset from the end.
 * @param {number} [end=array.length] The end position. A negative index will be treated as an offset from the end.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var array = [1, 2, 3, 4]
 *
 * _.slice(array, 2)
 * // => [3, 4]
 */
// 确保数组正确返回 
function slice(array, start, end) {
  // 获取 length
  let length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  // 获取 start 和 end  并且如果没写默认为0 和 length
  start = start == null ? 0 : start
  end = end === undefined ? length : end

  // start < 0 转成倒数第几个
  if (start < 0) {
    start = -start > length ? 0 : (length + start)
  }

  end = end > length ? length : end
  if (end < 0) {
    end += length
  }
  // start > end  ==> 0
  // >>> 0  这个操作是为了让其他类型 比如 object  array  变成 0 提高代码的健壮性
  length = start > end ? 0 : ((end - start) >>> 0)
  start >>>= 0
  let index = -1
  // 返回一个新的数组引用
  const result = new Array(length)
  while (++index < length) {
    // 赋值
    result[index] = array[index + start]
  }
  return result
}


module.exports = slice
