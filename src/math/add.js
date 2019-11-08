const createMathOperation = require('../utils/createMathOperation.js')

/**
 * Adds two numbers.
 *
 * @since 3.4.0
 * @category Math
 * @param {number} augend The first number in an addition.
 * @param {number} addend The second number in an addition.
 * @returns {number} Returns the total.
 * @example
 *
 * add(6, 4)
 * // => 10
 */
const add = createMathOperation((augend, addend) => augend + addend, 0)
console.log(add(4, 5));
console.log(add('4', '5'));
console.log(add(10));

module.exports = add
