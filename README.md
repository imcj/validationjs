validationjs
=============

validationjs可以帮助你更好的定义输入模型和验证输入的数据

## What is validationjs?

- **链式调用** 模型的定义更简单，更语义话
- validationjs 提供了丰富的数据类型、约束、字段的描述、示例。

```javascript
router.all('/signin', function(req, res) {
    var signin = validator("SigninForm")
        .field("username")
            .label('用户名')
            .description("电子邮件地址作为登录凭证")
            .placeholder('example@example.com')
            .required()
            .email()
        .field("password")
            .label("密码")
            .description("密码必须大于4位")
            .placeholder("请输入密码")
            .required()
            .min(4)
            .constraint(function(fieldName, fieldLabel, data) {
                var username = data['username'],
                    password = crypto
                        .createHmac('sha1', '')
                        .update(data['password'])
                        .digest('hex')

                var query = {
                    username: username,
                    hashedPassword: password
                }
                return User.findOne(query).then(function(user) {
                    if (null == user) {
                        return ["错误的用户名或者密码"]
                    }
                })
            })
        .new()

    var render = function() {
        res.render('signin', {
            form: signin
        })
    }

    if ("POST" == req.method) {
        signin.validate(req.body).then(function() {
            render()
        })
    } else
        render()
})
```

# 安装

```shell
$ npm install validationjs
```
**安装开发版** 从Git服务器下载最新版本

```shell
$ git clone https://github.com/imcj/validationjs
```

# 可用的验证规则

验证规则有常见的数据类型，如`array`, `string`，也有限定数据必需存在的`required`，还有描述更复杂的类型如`email`

## array
字段必需是数组

## required
字段是必需项

## string
字段类型是字符串类型

## integer
字段类型是整型

## numeric
字段类型是数字

## alpha
字段类型是A-Z的英文字符

## alphaNumeric
字段是A-Z0-9的字符

## alphaNumericSpace
字段是A-Z 0-9 还包含空格的字符

## alphaDash
字段是a-z 0-9 -_ 的字符类型

## boolean
字段是布尔类型

## between
between类型输入min和max两个参数 例如：`between(1, 5)`，可以校验的字段类型有字符串、数字和文件

## true
必需是true

## false
必需是false

## yes
和true一样

## no
和false一样

## greater
字段值必需大于输入的参数 例如：`greater(1)`

## greaterThan
字段值必需大于等于输入的参数 例如：`greaterThan(1)`

## less
字段值必需小于输入的参数 例：`less(1)`

## lessThan
字段值必需小于等于输入的参数 例：`lessThan(1)`

## decimal
定义小数类型，参数为限定小数的长度 例：`decimal(2)`

## json
字段是JSON类型

## in
字段的值必需在参数类型为数组的参数中也存在 例：`in('Male', 'Female')`

## notIn
字段的值必需在参数类型为数组的参数中不存在 例：`notIn(18, 19, 20)`

## digits
字段的值长度

## confirmed
对比两个字段的值是否相等，不相等则提示错误 `confirmed(password)`

## different
对比两个字段的值是否相等，相等则提示错误 `different(field)`

## email
定义一个内容格式为email类型的字段

## max
最大值不能超过指定的数值，可用来限定数字和字符串类型的字段长度

## min
最小值不能超过指定的数值，可用来限定数字和字符串类型的字段长度

## ip
字段的内容限定为IP v4地址

## regex
字段的值必需满足正则表达式的规则

## url
字段的内容限定为URL
