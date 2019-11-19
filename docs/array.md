# array 部分

1. [_.chunk](#_.chunk)

2. [_.slice](#_.slice)


## _.chunk
* 使用
> 将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。
```
  例子:
  _.chunk(['a', 'b', 'c', 'd'], 2);
  // => [['a', 'b'], ['c', 'd']]
  
  _.chunk(['a', 'b', 'c', 'd'], 3);
  // => [['a', 'b', 'c'], ['d']]
```

* 源码如下
```
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
```
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