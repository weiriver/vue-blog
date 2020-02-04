const config = {
  PORT: 5577, // 后台服务器端口号
  DATABASE: {
    database: 'blog',
    username: 'root',
    password: 'root',
    options: {
      host: 'localhost', // 连接的 host 地址
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true // 表名默认不加 s
      },
      timezone: '+08:00'
    }
  },
  ADMIN_GITHUB_LOGIN_NAME: 'weiriver',
  // ADMIN_GITHUB_LOGIN_NAME: 'gershonv',
  GITHUB: {
    // client_id: 'MDQ6VXNlcjMxNjYwMzQy',
    client_id: '31660342',
    client_secret: '955c5b01421ddcdbc642433e98caf9bd9dee3d41',
    access_token_url: 'https://github.com/login/oauth/access_token',
    fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
    fetch_user: 'https://api.github.com/users/' // fetch user url https://api.github.com/users/gershonv
  },
  EMAIL_NOTICE: {
    // 邮件通知服务
    // detail: https://nodemailer.com/
    enable: true, // 开关
    transporterConfig: {
      host: 'smtp.163.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'guodadablog@163.com', // generated ethereal user
        pass: '123456' // generated ethereal password 授权码 而非 密码
      }
    },
    subject: '郭大大的博客 - 您的评论获得新的回复！', // 主题
    text: '您的评论获得新的回复！',
    WEB_HOST: 'http://127.0.0.1:3000' // email callback url
  },
  TOKEN: {
    secret: 'river-test', // secret is very important!
    expiresIn: '720h' // token 有效期
  }
}
module.exports = config
