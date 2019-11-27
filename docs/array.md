# array 部分

1. [_.chunk](#_.chunk)
2. [_.slice](#_.slice)
3. [_.compact](#_.compact)
4. [_.baseFlatten](#_.baseFlatten)


## _.chunk
* 使用
> 将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。
```javascript
  例子:
  _.chunk(['a', 'b', 'c', 'd'], 2);
  // => [['a', 'b'], ['c', 'd']]
  
  _.chunk(['a', 'b', 'c', 'd'], 3);
  // => [['a', 'b', 'c'], ['d']]
```

* 源码如下
```javascript
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
```
  * 可以看到整个函数的实现不是很复杂, 先将传入的`size`变得合法, 让他一定是一个大于等于0的整数, 之后对传入的数组进行了一个判断, 如果没有数组或者`size`值为0, 那么直接返回一个空数组就好

  * 然后就是开辟一个新的数组, 用来当作最后返回的数组`result`, 下面没什么好说的, 就是通过`_.slice`方法对数组中的特定位置取值, 然后放入`result`中


## _.slice

* 使用
> 裁剪数组array，从 start 位置开始到end结束，但不包括 end 本身的位置。这个方法用于代替 `Array#slice` 来确保数组正确返回

* 源码
```javascript
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
```
  * 这个方法和原生的`Array.prototype.slice`实现的效果是一样的, 他更加安全, 确保了数组的正确返回
  * 首先通过判断传入的`array`是否是一个有效的, 如果无效直接`return []`
  * 对`start`和`end`判断是否传入, 没有传`start`会默认给0, 没有传`end`会默认给`array.length`, 之后看一下是否是负数, 如果是负数就按照`倒数第几个`这样的逻辑来重新给值
  * 这里有一个无符号位移的操作`start >>> 0`, 无符号位移`0`位相当于不变, 但是这个操作有个好处, 就是对于`数组或者对象这样的类型都会变成0`, 提高了程序的健壮性
  * 最后新开辟一个数组空间, 对原数组从`start`到`end`位置的值依次赋值, 最后返回即可

## _.compact

+ 创建一个新数组，包含原数组中所有的非假值元素。例如`false`, `null`, `0`, `""`, `undefined`, 和 `NaN` 都是被认为是“假值”。

+ 源码

+ ```javascript
  function compact(array) {
    let resIndex = 0
    const result = []
  
    if (array == null) {
      return result
    }
  
    for (const value of array) {
      if (value) {
        result[resIndex++] = value
      }
    }
    return result
  }
  
  ```

+ 这个函数其实很简单,  就是将数组遍历, 如果是真值, 就将其加入到一个新的数组中, 最后返回这个数组

## _.baseFlatten

+ 这个函数, 是`lodash`中实现各个数组扁平化操作的基础, 数组扁平化即减少数组的内部的嵌套程度

+ 源码

  ```javascript
  /**
   * The base implementation of `flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    predicate || (predicate = isFlattenable)
    result || (result = [])
  
    if (array == null) {
      return result
    }
  
    for (const value of array) {
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result)
        } else {
          result.push(...value)
        }
      } else if (!isStrict) {
        result[result.length] = value
      }
    }
    return result
  }
  ```

  + 首先看定义的几个参数,
    1. 第一个是传入的将要扁平化的那个数组
    2. 第二个是想要减少嵌套的层数
    3. 第三个是一个函数, 用来判断其中的某一项是否是可以被扁平化的, 如果没有传入`lodash`会默认传入一个`isFlattenable`
    4. 第四个参数是一个布尔值, 我的理解是, 如果`不填`或者给一个`false`, 最后的结果就是全部扁平化后的结果, 如果给一个`true`, 会将上一层不需要扁平化的项跳过
    5. 最后一个参数是初始化的结果, 如果是空, 默认是一个空数组
  + 先对数组进行遍历, 如果遍历到当前某一项是可以扁平化的, 那么就对当前项递归的调用当前方法, 并且当前的`depth - 1`