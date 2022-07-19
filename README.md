主技术栈：React生态(React 18.0 + react-router-v6 + TypeScript) <br /> 
构建工具：vite  <br />
UI组件库：Antd + less  <br />
Ajax：Axios  <br />


```shell
├── dist
├── api
│   ├── api  接口
│   └── http 请求封装
├── assets
│   ├── app.less  初始化css
│   └── global.less 全局css
├── components
|   ├── dd  dd方法
|   ├── department  获取部门组件
|   ├── header  头部组件
|   ├── layout  路由占位
|   ├── loading  全局loading
|   ├──lookResult    查看结果
|   |  ├── MBTI  结果页
|   |  └── PDP 结果页
|   ├── menu  侧边栏组件
│   └── Steps 新手引导组件
├── page
|   ├── 402  应用内授权
|   ├── 403  用户当前的状态（是否有权限，是否在有效期等）
|   ├── 404  noFount
|   ├── evaluation  主页
|   |   ├── library  测评库
|   |   |   └── AddPeople 添加人员
|   |   ├── management  盘点管理
|   |   |   ├── detail  查看详情
|   |   |   └── library 创建测评
|   |   ├── peopleReport  人才报告
|   |   |   └── detail 查看报告
|   |   ├── recharge 充值页
|   |   |   ├── consumeTable  点券消耗记录
|   |   |   └── topupTable 点券充值记录
|   |   └── userAuthority 权限管理
│   └── login 登录页
│   ├── App.vue app入口
│   ├── main.js  入口文件
│   ├── router   路由
│   ├── global.d.ts  全局ts声明
│   └── utils  
|   |   ├── context  createContext声明
|   |   ├── hook  自定义hook声明
│   |   └── utils  公共方法
├──.env.daily   日常打包用到的配置文件
├──.env.gray    预发打包用到的配置文件
├──.env.prod    线上打包用到的配置文件
├──.gitignore   不打包的文件
├── index.html 
├── package.json
├── tsconfig.json  ts配置文件
└── vite.config.js   vite配置文件
```

打包项目<br />
npm run build:daily  日常打包  <br />
npm run build:gray   预发打包  <br />
npm run build:prod   线上打包  <br />


项目启动<br />
npm i   <br />
npm run dev  <br />
