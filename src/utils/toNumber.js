const isObject = require('./isObject.js')
const isSymbol = require('./isSymbol.js')

/** Used as references for various `Number` constants. */
const NAN = 0 / 0

/** Used to match leading and trailing whitespace. */
const reTrim = /^\s+|\s+$/g

/** Used to detect bad signed hexadecimal string values. */
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i

/** Used to detect binary string values. */
const reIsBinary = /^0b[01]+$/i

/** Used to detect octal string values. */
const reIsOctal = /^0o[0-7]+$/i

/** Built-in method references without a dependency on `root`. */
const freeParseInt = parseInt

/**
 * Converts `value` to a number.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @see isInteger, toInteger, isNumber
 * @example
 *
 * toNumber(3.2)
 * // => 3.2
 *
 * toNumber(Number.MIN_VALUE)
 * // => 5e-324
 *
 * toNumber(Infinity)
 * // => Infinity
 *
 * toNumber('3.2')
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value === 'number') {
    return value
  }
  if (isSymbol(value)) {
    return NAN
  }
  if (isObject(value)) {
    // {}.valueOf() => {}
    // 拆箱后的对象类型, 为了区分是否是装箱类型
    const other = typeof value.valueOf === 'function' ? value.valueOf() : value
    console.log(value.valueOf(), 'value.valueOf()');
    console.log(other, 'other', typeof other);
    // `${ {} }` => [object Object]
    value = isObject(other) ? `${other}` : other
    console.log(value);
  }
  if (typeof value !== 'string') {
    console.log(value, 'value');
    return value === 0 ? value : +value
  }

  // 除空格
  value = value.replace(reTrim, '')
  console.log(value);
  const isBinary = reIsBinary.test(value)
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value)
}

console.log(toNumber({ a: 1 }));

module.exports = toNumber
