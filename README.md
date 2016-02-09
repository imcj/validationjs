validationjs
=============

用validationjs定义一个模型，用于描述输入的数据和校验数据是否正确。

```javascript
var registration = validator("RegistrationForm")
    .field("email")
        .description("电子邮件地址")
        .example('example@example.com')
        .placeholder('example@example.com')
        .email()
        .addConstraint(new constraints.UniqueUsernameConstraint())
    .field("password")
        .description("密码是登录的凭据，请妥善保管。")
        .example('a1ek')
        .placeholder("请输入密码")
        .required()
        .min(4)
    .field("passwordAgain")
        .description("请重复输入密码")
        .example('a1ek')
        .placeholder("请重复输入密码")
        .confirmed("password")
        .required()
```
