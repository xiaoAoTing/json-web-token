const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

// 指定密钥，一般放在环境变量中
const secret = "aksjdlasldkj";
const app = express();

app.use(express.static(path.join(process.cwd(), "./web"))); // 开放静态文件目录
app.use(express.urlencoded({ extended: true })); // 解析荷载数据

// 登录接口
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log('username', username)
  console.log('password', password)

  if (!username || !password) {
    return res.json({ error: 1, msg: '用户名或密码错误' })
  }

  // NOTICE
  // 正常来说这里会在数据库中验证「用户名」和「密码」，通过验证的话才会 sign 签名
  
  /**
   * jwt.sign
   * 参数1: 要加密的数据 payload
   * 参数2: 密钥
   */
  jwt.sign({ username, password }, secret, (err, token) => {
    if (err) {
      return res.json({ error: 1, msg: "加密token失败了" });
    }
    // 将token返回给前端
    res.json({ error: 0, token });
  });
});

// 客户端获取数据
app.post("/getData", (req, res) => {
  const { token } = req.body;

  jwt.verify(token, secret, (err, data) => {
    if (err) {
      throw err
    }
    res.json({ error: 0, data });
  });
});

app.listen(3000, () => console.log("监听在3000端口号"));
