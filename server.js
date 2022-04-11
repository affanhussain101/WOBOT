const express = require('express');
const jwt= require('jsonwebtoken');
const mongoose = require('mongoose')
const bodyParser = require("body-parser");


const app = express();
const {SECRET} = require("./keys"); 
const { Db } = require('mongodb');
const { compile } = require('ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

 mongoose.connect('mongodb://localhost:27017/proj2',
    console.log("databse connected")
);
var con = mongoose.connection;

app.get('/', function (req, res) {
    res.render(__dirname+"/views/Login.ejs");
})
app.get('/Login', function (req, res) {
res.render(__dirname+"/views/Login.ejs"); 
})
var data;
app.get('/signup', function (req, res) {
    res.render(__dirname+"/views/signup.ejs"); 
    })
    app.get('/main', function (req, res) {
        con.collection('users').find({}).toArray((err,data)=> {
            if(err)
            throw err;
            console.log(data);
            res.render('main', { title: 'main', main: data});
            
        })
        // res.render(__dirname+"/views/main.ejs"); 
        })

  
  
app.post('/login', function(req, res) {
    username=req.body.username
    password=req.body.password
    con.collection('users').find({}).toArray((err,data)=> {
        if(err)
        throw err;
        console.log(data);
     console.log(req.body);
     if(data.length!=0){
        var i=1;
        data.forEach(function(dat){
     if (!(username === dat.email && password === dat.pass)) {
       res.status(401).send('Wrong user or password');
       console.log('failed login');
       res.redirect("/")
       return;
     }
     else if ((username === dat.email && password === dat.pass)){

     const token = jwt.sign({username: req.body.username},SECRET,{
       expiresIn:'5s'
     })
     console.log(token);
     console.log('successful login');
     res.redirect("/main")
      return res.json({token});
   }
   else 
   jwt.destroy(token);
   res.redirect('Login')
        }) 
}
})
})

 app.post('/Signup', function(req,res,next){
     var name = req.body.name;
     var number = req.body.number;
     var email= req.body.email;
     var pass= req.body.pass;

     var data= {
         "name": name,
         "number": number,
         "email": email,
         "password":pass
     }
    con.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("record inserted sucessfully")
    })
    return res.redirect('/')
 })

app.listen(3000, () => {
 console.log("Server is running on port 3000");
})