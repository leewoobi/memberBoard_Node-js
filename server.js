const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
require('dotenv').config(); // 환경변수
var db;


MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true },  (error, client)=>{
    if(error) return console.log(error)
    db = client.db('beta_db');
    app.db = db;

    app.listen(process.env.PORT, ()=>{
        console.log('listening on 8080')
    });
});

app.use(methodOverride('_method'))
app.use('/public',express.static('public'));
app.use(bodyParser.urlencoded({extended : true })); //bodyParser
// app.use('/node_modules', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.set('view engine', 'ejs'); //ejs 
app.use('/',require('./routes/route.js')); // routes 



 app.post('/add',(req, res)=>{
    //  response.send('전송완료');
    res.redirect('/list');
     db.collection('counter').findOne({name: 'postNum' }, (error, result)=>{
         console.log(result.totalPost)
         var totalPostNum = result.totalPost;
         db.collection('posts').insertOne({_id:totalPostNum + 1, title: req.body.title , date: req.body.date}, (error, result)=>{
         db.collection('counter').updateOne({name:'postNum'},{ $inc : {totalPost:1}}, (error,result)=>{
                if(error){return console.log(error)}
            });
        console.log('저장완료');
        });
     });
 });

 

 app.delete('/delete',(req,res)=>{
    console.log(req.body);
    req.body._id  = parseInt(req.body._id);  
    db.collection('posts').deleteOne(req.body, (error,result)=>{
        console.log('삭제완료')
        res.status(200).send({message:'성공했습니다'});
    }  )
})

app.put('/edit', (req,res)=>{
    db.collection('posts').updateOne({_id : parseInt(req.body.id) },{ $set : { title:req.body.title, date: req.body.date }},(error, result)=>{
        console.log('수정완료')
        res.redirect('/list')
    })
})