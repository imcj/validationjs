validationjs
=============

validationjs可以帮助你更好的定义输入模型和验证输入的数据

## What is validationjs?

- **链式调用** 模型的定义更简单，更语义话
- 利用validationjs可以定义数据的类型、约束、增加字段的描述、示例。

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
