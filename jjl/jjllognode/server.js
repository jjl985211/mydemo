const express =require("express")
const router=require("./router.js")
const bodyParser =require("body-parser")
const cors = require('cors');
const app =express()
//由于并未连接数据库，因此myUser全局变量暂时保存了用户的所有数据。持续时间为关闭当前服务器或修改node.js内容之前
let myUser= [];
//这里定义的count全局变量，用来暂时模拟客户的id值
let count=0;
app.locals.count=count
app.locals.myUser = myUser;
app.use(express.static('./public'))
app.use(cors());
app.use(bodyParser.json());
app.use("/",router)
app.listen(3000,()=>{
    console.log("localhost:3000")
})