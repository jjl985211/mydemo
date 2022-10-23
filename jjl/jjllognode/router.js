const express =require("express")
const router =express.Router()
//这里的filter.js函数是对数组多条件，多数据筛选的封装
const myfilter=require("./filter")
//通过前端注册表单提交的数据，UserRegistration API保存了不同用户的所有的信息，包括用户名，用户密码，用户id，用户关注的其他用户
//这里的isConcerned和isConcernedValue记录用户关注的行为，表现在客户端为用户是否已经关注某个用户，若关注isConcernedValue
//就会变为“已关注”，isConcerned就会变为true表示不能再进行相同用户的关注操作
router.post("/UserRegistration",(req,res,next)=>{
    let data=req.body
    req.app.locals.count++
    req.app.locals.myUser.push({username:data.username,password:data.password,
        userid: req.app.locals.count,myconcern:[],isConcerned:false,isConcernedValue:"关注"})
    res.send("done")
})
//getUserInfo API表示客户端登录操作。即将当前客户端登录的用户名与myUser全局变量里所有用户进行姓名匹配，然后返回该用户的所有信息供客户端验证用户登录使用
router.get("/getUserInfo",(req,res,next)=>{
    console.log( req.app.locals.myUser)
    let url =req.query
    let username=url.myname
    let logUserName=req.app.locals.myUser.find((re,ind,arr)=>re.username==username)
        res.send(logUserName)
})
//修改用户密码，这里因为没有短信验证码因此简单使用用户名修改用户密码
router.get("/updatePassWord",(req,res,next)=>{
    let url=req.query
    let username=url.currentName
    if(url.newpassword==undefined){
        let result=req.app.locals.myUser.find((re,ind,arr)=>re.username==username)
        res.send(result)  
    }
   else{
    req.app.locals.myUser.find((re,ind,arr)=>re.username==username).password=url.newpassword
    res.send("done")
   }
})
//followtheuser API表示当前的所有用户，供客户端推荐用户使用
router.get("/followtheuser",(req,res,next)=>{
    res.send(req.app.locals.myUser)
})
//toconcern API 表示当前用户关注的其他用户具体解释如下
//这里通过客户端http请求参数的不同对toconcern API进行了分类，myConsernUserId！=undefined表示用户点击关注按钮后
//将其他用户id的传入到该用户的myconcern数组中，然后在总用户数据（myUser）中利用filter过滤出包含该id的用户数据，最后这些用户数据返回给客服端
//myConsernUserId==undefined表示该用户在刷新页面后请求的所有的已经关注了用户的用户数据。这样可以防止页面刷新后关注用户数据丢失
//注意：如果连接数据库后则不需要对toconcern API进行分类
router.get("/toconcern",(req,res,next)=>{
    let url=req.query
    if(url.myConsernUserId!=undefined){
        req.app.locals.myUser.find((re,ind,arr)=>re.username==url.username).myconcern.push(Number(url.myConsernUserId))
        let b=req.app.locals.myUser.find((re,ind,arr)=>re.username==url.username).myconcern
        let filter={
            userid:b
        }
       let resuilt= myfilter( req.app.locals.myUser,filter)
        res.send(resuilt)
    }
    else{   
        let m=req.app.locals.myUser.find((re,ind,arr)=>re.username==url.username).myconcern
        let filter1={
            userid:m
        }
        let resuilt1= myfilter( req.app.locals.myUser,filter1)
        req.app.locals.myUser.forEach((value)=>{
            value.isConcerned=false
            value.isConcernedValue="关注"
           })
        if(resuilt1.length==0){      
        }else{
            resuilt1.forEach((value)=>{
                value.isConcerned=true
                value.isConcernedValue="已关注"
            })
        }
        res.send(resuilt1)
    }
})
module.exports=router