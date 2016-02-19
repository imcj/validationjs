# validationjs

validationjs可以帮助你更好的定义输入模型和验证输入的数据

## What is validationjs?

- **链式调用** 模型的定义更简单，更语义话
- validationjs 提供了丰富的数据类型、约束、字段的描述、示例。

## Demo

```javascript
router.all('/signin', function(req, res) {
    var signin = validator("SigninForm")
        .field("username")
            .label('Username')
            .description("email address as login credentials")
            .placeholder('example@example.com')
            .required()
            .email()
        .field("password")
            .label("Password")
            .description("Password length must greater 4")
            .placeholder("Please type a strong password")
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
                        return ["Wrong username or password"]
                    }
                }).catch(function(error) {
                    console.stack(error)
                })
            })
        .new()

    var render = function() {
        res.render('signin', {
            form: signin
        })
    }

    if ("POST" == req.method) {
        debug("/signin post")
        signin.validate(req.body).then(function() {
            if (signin.valid())
                res.render('signin_success')
            else
                render()
        }).catch(function(error) {
            debug(error)
            debug(error.stack)
        })
    } else
        render()
})
```

### Jade template

```jade
extends layout

block content
  .container
    .row
      .col-md-4
        div(class=['panel', 'panel-default'])
          .panel-heading
            h3(class='panel-title') Signin
          .panel-body
            form(method="post", enctype="application/x-www-form-urlencoded")
              div(class=['form-group', form.username.hasErrors() ? 'has-error':''])
                label(for='email', class='control-label') Username
                input(type='email', class='form-control', placeholder='#{form.username.placeholder}', name="username", value='#{form.username.value}')
                if form.username.hasErrors()
                  each error in form.username.errors
                    span(class='help-block') #{error.message}
              div(class=['form-group', form.password.hasErrors() ? 'has-error':''])
                label(for='password') Password
                input(type='password', class='form-control', placeholder='#{form.password.placeholder}', name="password", value='#{form.password.value}')
                each error in form.password.errors
                  span(class='help-block') #{error.message}
              button(type='submit', class=['btn', 'btn-primary']) Signin
              a(href="/", id="signup_link") Signup
              a(href="/forgot") forgot?

```

# 安装

```shell
$ npm install validationjs
```
Get dev version from git repository

```shell
$ git clone https://github.com/imcj/validationjs
```

# 自定义约束

`validationjs`并不能提供所有的规则，所以你需要编写自己的约束来定义这些规则，比如`usernameUnique`，
我们想要限定用户的名称必需是唯一的，然而每一个用户系统都有差别，限制用户名在系统中是唯一的这个
规则不是每一个应用都一样，所以validationjs不能提供这种规则，这时我们就需要定义自己的约束。

```javascript
constraint(callback_function(fieldName, fieldLabel, data) {
    return ["has error"]
})
```

我们可以使用`constraint(callback_function)`方法定义约束，`callback_function`是一个自定义的回调
方法，我们在这个方法内编写自己的规则代码，这个方法接受三个参数：

- fieldName String类型，字段的名称，在请求的数据中作为键
- fieldLabel String类型，字段的Label
- data Object类型，请求的数据，`data[fieldName]`拿到当前字段的值

callback_function 返回一个数组，数组有两种类型的项，`String`和`FieldError`，`String`
类型的返回值会转换成`FieldError`，`constraint`构造一个`FieldError`，并把`String`作为
`FieldError`对象的`message`属性。

```javascript
constraint(callback_function(fieldName, fieldLabel, data) {
    return [new FieldError("field", "Field", "error")]
})
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
对比两个字段的值是否相等，不相等则提示错误

```javascript
validation("SigninForm")
    .field("password")
    .field("passwordAgagin")
        .confirmed(password)
```

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
