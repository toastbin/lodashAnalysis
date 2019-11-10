# Math 部分

* [_.add](#_.add)
  + [createMathOperation](#createMathOperation)
    - [baseToNumber](#baseToNumber)
    - [baseToString](#baseToString)

* [_.ceil](#_.ceil)
  + [createRound](#createRound)
* [_.meanBy](#_.meanBy)
  + [baseSum](#baseSum)

## _.add

* 使用

``` 
  参数
  augend (number): 相加的第一个数。
  addend (number): 相加的第二个数。
  返回
  (number): 返回总和。
```

* `_.add` 函数源码如下, 可以很清楚的看到这个函数是由 `createMathOperation` 这个函数生成的, 第一个参数是一个函数, 这个函数有两个参数, 根据参数名称, 可以猜到是两个传入的要相加的数, 然后返回这两个数的和, 第二个参数是一个写死的 `0` 

``` 
  const add = createMathOperation((augend, addend) => augend + addend, 0)
```

### createMathOperation

``` 
  function createMathOperation(operator, defaultValue) {
    return (value, other) => {
      // 缺失参数的情况
      if (value === undefined && other === undefined) {
        return defaultValue
      }
      if (value !== undefined && other === undefined) {
        return value
      }
      if (other !== undefined && value === undefined) {
        return other
      }
      if (typeof value === 'string' || typeof other === 'string') {
        value = baseToString(value)
        other = baseToString(other)
      }
      else {
        value = baseToNumber(value)
        other = baseToNumber(other)
      }
      return operator(value, other)
    }
  }

```

* 他直接 `return` 了一个函数, 这个 `return` 的函数接收的两个参数就是传入的两个 `加数` , 首先他对参数的数量是否合法进行了分类, 如果两个参数都没有, 直接返回 `deafaultValue` 也就是 `0` , 如果只有一个参数, 那么就直接返回了另一个参数, 如果参数的数量是合法的, 他会先判断参数是否是字符串, 只要有一个是, 会通过 `baseToString` 将其全部转成一个字符串, 如果参数中并没有字符串, 通过 `baseToNumber` 确保的转成数值, 最后执行第一个传入的 `operator` , 最后返回的是传入的 `operator(value, other)` , 这下我们明白了, `operator` 是规定运算的种类, 因为当前是 `_.add` 所以传入的 `operator` 是 `(augend, addend) => augend + addend` , 同样的对四则运算都可以进行扩展, 上述用到了两个转换类型的函数 `baseToString` 和 `baseToNumber` , 我们来看一下他们都做了什么

#### baseToNumber

    

  + 这个函数很简单, 先使用 `typeof` 判断是不是一个 `number` 类型, 如果是, 不需要转
  + 之后判断是不是 `symbol` 类型, 如果是 `symbol` 类型不能转成 `number` , 直接返回 `NaN` 
  + 如果面两个判断都没中, 直接返回 `+value` 

``` 
  const NAN = 0 / 0
  function baseToNumber(value) {
    if (typeof value === 'number') {
      return value
    }
    if (isSymbol(value)) {
      return NAN
    }
    return +value
  }
```

#### baseToString

  + 同样的, 也是先使用 `typeof` 判断是不是一个 `string` , 如果是不需要转
  + 之后判断是不是一个数组, 如果是数组, 就递归数组每一项执行
  + 如果是一个 `symbol` 类型, 通过 `Symbol.prototype.toString.call(value)` 转成字符串
  + 如果以上都没中, 直接使用模板字符串进行转, 这种方法的好处是, 如果是一个基本类型比如, 一个数字 `1` , 使用 ` ` ${1} `  ` 之后会转成字符串, 而如果是一个对象类型, 和使用 ` Object.prototype.call({}) ` 一样, 返回 ` [Object object]` , 也就是说对于基本类型比如 `数字` , 进行正常转换, 不是基本类型转成 `[Object xxx]` 这种形式
  + 最后的最后, 会对 是否是 `-0` 进行一个判断, 否则无论 `-0` 还是 `+0` 都会输出 `0` , 这里先是对已经转换了的结果 `result` 进行一个无关类型的 `==` 比较, 看他是否 `0` , 如果是 `0` 再看看是不是 `-0` , 具体细节源码中展现的已经比较清楚了..

``` 
  const symbolToString = Symbol.prototype.toString
  const INFINITY = 1 / 0
  function baseToString(value) {
    if (typeof value === 'string') {
      return value
    }
    if (Array.isArray(value)) {
      return `${value.map(baseToString)}` 
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : ''
    }
    const result = `${value}` 
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
  }
```

> 总结一下, 通过 `createMathOperation(operator, defaultValue)` 传入一个运算函数, 返回一个新的 `_.add` 函数, 并且通过 `baseToNumber` 和 `baseToString` 进行了类型转化, 同样的另外的一些运算也可以按照类似来实现

## _.ceil

* 使用: 向上取整, 并且可以传入想要保留的精度

``` 
参数
number (number): 要向上舍入的值。
[precision=0] (number): 向上舍入的的精度。
返回
(number): 返回向上舍入的值。
```

* 这个方法同样也是一个函数生成的, 

``` 
const ceil = createRound('ceil')
```

### createRound

* 先通过传入相应的字符串, 获取原生 `Math` 对象的向上取整函数, 并保留到 `func` 变量
* `return` 一个新的函数, 第一个参数是将要取整的数, 第二个参数是精度
  + 判断是否有 `precision` 参数, 如果没有初始化成 `0` , 即不保留精度
  + 如果有传入, 进行一个位数的限制
  + 下面的操作实际上是利用 `科学记数法` 先转成一个大数, 然后对其使用 `func` 取整, 再用用 `科学记数法` 转成该精度的小数
    - 举个例子 例如我们现在要转化的数是 `6.004` , 要求精度是 `2` 
    - 先转成 `6.004 e 2 => 600.4` 
    - 对其取整 `func(601)` 
    - 转回小数 `601 e -2 => 6.01` 

``` 
  function createRound(methodName) {
    const func = Math[methodName]
    return (number, precision) => {
      precision = precision == null ? 0 : (precision >= 0 ? Math.min(precision, 292) : Math.max(precision, -292))
      if (precision) {
        let pair = `${number}e` .split('e')
        const value = func( `${pair[0]}e${+pair[1] + precision}` )
        pair = `${value}e` .split('e')
        return + `${pair[0]}e${+pair[1] - precision}` 
      }
      return func(number)
    }
  }
```

> 相似的, 可以实现 `向下取整` , `四舍五入取整` , 只要在最开始获取 `Math` 的原生方法不一样即可

# _.meanBy

* 使用: 接受 iteratee 来调用 array中的每一个元素，来生成其值排序的标准。 iteratee 会调用1个参数: (value) 

``` 
参数
array (Array): 要迭代的数组。
[iteratee=_.identity] (Function): 调用每个元素的迭代函数。
返回
(number): 返回平均值。
```

* 先判断数组是否有元素, 如果有调用 `baseSum` 算出总和再除一下

``` 
const NAN = 0 / 0
function meanBy(array, iteratee) {
  const length = array == null ? 0 : array.length
  return length ? (baseSum(array, iteratee) / length) : NAN
}
```

## baseSum

* 用 `for of` 遍历数组, 对每一项执行传入的 `iteratee` , 然后累加

``` 
function baseSum(array, iteratee) {
  let result

  for (const value of array) {
    const current = iteratee(value)
    if (current !== undefined) {
      result = result === undefined ? current : (result + current)
    }
  }
  return result
}
```

