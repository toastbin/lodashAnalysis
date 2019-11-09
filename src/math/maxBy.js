const isSymbol = require('../utils/isSymbol')

/**
 * This method is like `max` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per element.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * const objects = [{ 'n': 1 }, { 'n': 2 }]
 *
 * maxBy(objects, ({ n }) => n)
 * // => { 'n': 2 }
 */
function maxBy(array, iteratee) {
  let result
  // array exist?
  if (array == null) {
    // not exist return undefined
    return result
  }

  let computed
  // 'of' traverse array
  for (const value of array) {
    // run iteratee for every items
    const current = iteratee(value)

    // computed === undefined ==> first circulation 
    if (current != null && (computed === undefined
      // is symbol ? 
      ? (current === current && !isSymbol(current))
      // judge
      : (current > computed)
    )) {
      computed = current
      result = value
    }
  }
  return result
}

console.log(maxBy([{ a: 1 }, { a: 2 }], a => a.a));

module.exports = maxBy
