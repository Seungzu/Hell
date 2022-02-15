const express = require('express')
const nunjucks = require('nunjucks')
const app = express()
const list = require('./model/list.js')
const user = list.user

let item = []
let useritem = []


app.use(express.urlencoded({extended:true,}))

app.set("view engine",'html')
nunjucks.configure('views',{
    express:app,
})

app.get('/',(req,res)=>{
    let isLogin = false

    if(req.headers.cookie === undefined){
        res.render('index.html',{
            isLogin,
        })
    } else {
        isLogin = true
        res.render('index.html',{
            isLogin,
        })   
    }
})

app.get('/login',(req,res)=>{
    res.render('login.html')
})

app.post('/login',(req,res)=>{
    let userid = req.body.userid
    let userpw = req.body.userpw
   
    for(let i=0; i<user.length; i++){
        if(user[i].userid == userid && user[i].userpw == userpw){
            console.log('아이디 비번 맞어')
            item.push(userid)
            useritem.push(user[i].username)
            res.setHeader(`Set-Cookie`,`login=${item[0]}; path=/`)
            res.redirect('/')
            break ;
            
        } else {
            console.log('틀려')
        }
    }    
    if(item.length == 0){
        res.redirect('/login')
    }
})

app.get('/logout',(req,res)=>{
    res.setHeader('Set-Cookie',`login=${item[0]}; max-age=0`)
    res.redirect('/')
})

app.get('/profile',(req,res)=>{
    let userid = req.headers.cookie.split("=")[1]
    
    if(item[0] === userid){
        res.render('profile.html',{
            userid:item[0],
            username:useritem[0]
        })
    } else {
        res.redirect('/')
    }
})

app.listen(3000,()=>{
    console.log('asdfffff')
})