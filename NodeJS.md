#### Express中间件的原理和实现，以及Express整体的实现
- https://stackblitz.com/edit/js-hamweh
- https://juejin.im/post/5a9b35de6fb9a028e46e1be5
#### 使用require来导入js文件，和import类似。但是注意其中的语句也会被执行
- 注意：我们一个项目有且只有一个 node_modules，放在项目根目录中，这样的话项目中所有的子目录中的代码都可以加载到第三方包
  不会出现有多个 node_modules
  模块查找机制
     优先从缓存加载
     核心模块
     路径形式的文件模块
     第三方模块
       node_modules/art-template/
       node_modules/art-template/package.json
       node_modules/art-template/package.json main
       index.js 备选项
       进入上一级目录找 node_modules
       按照这个规则依次往上找，直到磁盘根目录还找不到，最后报错：Can not find moudle xxx
     一个项目有且仅有一个 node_modules 而且是存放到项目的根目录

```
let a = require('/a.js');
// 导出特定的内容需要手动挂载到接口对象exports上
// 在a中
function add(x, y) {
    return x + y;
}
exports.add = add;
module.exports = "sss"; //只输出一个变量。这样会有相互覆盖的问题
module.export = {}; // 输出多个对象
```


#### 原生node js
##### 建立服务器
- 如何通过服务器让客户端重定向？
    1. 状态码设置为 302 临时重定向
        statusCode
    2. 在响应头中通过 Location 告诉客户端往哪儿重定向
       setHeader
    3. 如果客户端发现收到服务器的响应的状态码是 302 就会自动去响应头中找 Location ，然后对该地址发起新的请求
    所以你就能看到客户端自动跳转了
    301的话就会是永久重定向了
```
var http = require('http');
var server = http.createServer();
server.on('request', (request, response) => {
   // handle the request
    response.setHeader();
    response.write();
    response.end();
    response.statusCode = 302;
    response.setHeader('Location', '/');
});
server.listen(3000, () => {
    //do sth after successfully build the server with proxy 3000
});
```

##### read file with fs
- `readFile(path, cb(err, data))`
- `writeFile(path, cb(err))`
- `readdir(path, cb)` 读取指定目录下所有的路径，路径名称以数组形式返回

```
var fs = require('fs');
fs.readFile('path', (err, data) => {
    // callback
});
fs.writeFile('path', 'content', (err) => {
    // callback
});

fs.readdir('./', function (err, files) {
    if (err) {
        return console.log('目录不存在')
    }
    console.log(files)
})
```

#### art-template模板引擎
- 用于填充html页面中内容的。后端渲染页面使用


#### path 模块
- 用来获取文件或者目录的绝对路径

```
const path = require('path');
path.join(__dirname, './node_modules/');
__dirname // 当前文件目录所属绝对路径
__filename // 当前文件所属绝对路径
```

#### url模块

- 使用 url.parse 方法将路径解析为一个方便操作的对象，第二个参数为 true 表示直接将查询字符串转为一个对象（通过 query 属性来访问）
- 单独获取不包含查询字符串的路径部分（该路径不包含 ? 之后的内容）

```
var url = require('url');
var parseObj = url.parse(req.url, true);
var pathname = parseObj.pathname;
```


#### Node js 本身不支持ES6语法时候如何处理

- 如何让Node.js支持ES6的语法: https://yanyinhong.github.io/2017/06/30/Support-ES6-for-nodejs/
- babel安装问题: https://segmentfault.com/q/1010000009650275
- 总结一下就是必须用babel转译之后才能使用import


#### express
- 初始化

```
let express = require('express');
var app = express();
app.use('/public/', express.static('./public/')); // 将./public/公开作为静态资源路径。可以直接通过/public/xx 的方式访问目录所有资源
app.get('/', (req, res) => {    //收到get请求'/'时候的回调
    res.send(`sssss`);
});

app.listen(3000, () => {//    和原生的server一样

});

res.statusCode = 302;
res.setHeader('Location', '/');
res.send();
// 以上三句可以被一句express API解决
res.redirect('/');
```

- 如果想要修改默认的 views 目录，则可以
`app.set('views', 'render函数的默认static文件路径')`

- 注意express不能直接解析post请求中的数据，需要body-parser来辅助配置 body-parser 中间件（插件，专门用来解析表单 POST 请求体）

```
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// 当具体使用时候，只要完成了上面两步，req中会自动多出来，body这个属性
let data = req.body;
```

- express可以直接获取get中内容
`let data = req.query;`

- 当路由量很大时候需要分开到router.js中来写，在router.js中直接作为函数 exports出来，参数为app中传入的module
  + 在router.js中
  ```
  let express = require('express');
  let fs = require('fs');
  let router = express.Router();
  router.get('/', (req, res) => {
      fs.readFile('./db.json', 'utf-8', (err, data) => {
          if (err) {
              return res.status(500).send('Server error');
          }
          let students = JSON.parse(data).students;
          res.render('index.html', {
              fruits: ['苹果', '香蕉', '橘子'],
              students
          });
      });

  });
  module.exports = router;
  ```

  + app.js中使用时
  ```
  let router = require('./router.js');
  app.use(router);
  ```


#### 使用mongoose 操作MongoDB
- 初始化

```
var mongoose = require('mongoose')
var Schema = mongoose.Schema
```
- 然后连接数据库， 指定连接的数据库不需要存在，当你插入第一条数据之后就会自动被创建出来

`mongoose.connect('mongodb://localhost/itcast', { useNewUrlParser: true })`

- 设计数据库schema 字段名称就是表结构中的属性名称 约束的目的是为了保证数据的完整性，不要有脏数据

```
var userSchema = new Schema({
    username: {
        type: String,
        required: true // 必须有
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
})
```

- 将文档结构发布为模型
  + mongoose.model 方法就是用来将一个架构发布为 model.
  + 第一个参数：传入一个大写名词单数字符串用来表示你的数据库名称. mongoose 会自动将大写名词的字符串生成 小写复数 的集合名称.例如这里的 User 最终会变为 users 集合名称.
  + 第二个参数：架构 Schema. 返回值：模型构造函数
  + `var User = mongoose.model('User', userSchema)`

- 当我们有了模型构造函数之后，就可以使用这个构造函数对 users 增删改查
  + 新增数据

    ```
    var admin = new User({
      username: 'zs',
      password: '123456',
      email: 'admin@admin.com'
    }) // 创建一个User schema的数据

    admin.save(function (err, ret) {
      if (err) {
        console.log('保存失败')
      } else {
        console.log('保存成功')
        console.log(ret)
      }
    }) // 存进去
    ```

- 查询数据
  + findOne
  + find

```
User.find(function (err, ret) {
if (err) {
console.log('查询失败')
} else {
console.log(ret)
}
})

User.find({
username: 'zs'
}, function (err, ret) {
if (err) {
console.log('查询失败')
} else {
console.log(ret)
}
})


User.findOne({
username: 'zs'
}, function (err, ret) {
if (err) {
console.log('查询失败')
} else {
console.log(ret)
}
})
// promise 版的
User.findOne({
username: 'aaa'
})
.then(function (user) {
  if (user) {
      // 用户已存在，不能注册
      console.log('用户已存在')
  } else {
      // 用户不存在，可以注册
      return new User({
          username: 'aaa',
          password: '123',
          email: 'dsadas'
      }).save()
  }
})
.then(function (ret) {
})
```



- 删除数据
  + remove
  + findByIdAndRemove

  ```
  User.remove({
    username: 'zs'
  }, function (err, ret) {
    if (err) {
      console.log('删除失败')
    } else {
      console.log('删除成功')
      console.log(ret)
    }
  })
  ```

- 更新数据
  + findByIdAndUpdate

  ```
  User.findByIdAndUpdate('5a001b23d219eb00c8581184', {
    password: '123'
  }, function (err, ret) {
    if (err) {
      console.log('更新失败')
    } else {
      console.log('更新成功')
    }
  })
  ```


#### 使用express-session
- 用来记录用户登陆状态的. 通常直接把查询到的用户信息存入session

  ```
  const session = require('express-session');
  app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
  }));
  // 设置和返回session
  req.session.foo = 'bar';
  req.session.foo;
  ```



#### express 中间件， 满足对同一个url请求分步执行操作

```
app.use(function (req, res, next) {
    console.log(1)
    next()
})

app.get('/abc', function (req, res, next) {
    console.log('abc')
    next()
})

app.get('/', function (req, res, next) {
    console.log('/')
    next()
})

app.use(function (req, res, next) {
    console.log('haha')
    next()
})

app.get('/abc', function (req, res, next) {
    console.log('abc 2')
})

app.use(function (req, res, next) {
    console.log(2)
    next()
})

app.get('/a', function (req, res, next) {
    console.log('/a')
})

app.get('/', function (req, res, next) {
    console.log('/ 2')
})

// 如果没有能匹配的中间件，则 Express 会默认输出：Cannot GET 路径
```

#### async 和 await处理异步
- http://es6.ruanyifeng.com/#docs/async

```
router.post('/register', async (req, res) => {
    let body = req.body;
    try {
        if (await User.findOne({email: body.email})) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱已注册'
            });
        }

        if (await User.findOne({nickname: body.nickname})) {
            return res.status(200).json({
                err_code: 2,
                message: '昵称已注册'
            });
        }
        body.password = md5(md5(body.password));
        let data = await new User(body).save();
        console.log(data, '注册成功');
        res.status(200).json({
            err_code: 0,
            message: '注册成功'
        });

    } catch (err) {
        return res.status(500).json({
            err_code: 500,
            message: err.message
        });
    }
}
```
