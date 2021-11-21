const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

var db;

MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true },  (error, client)=>{
    if(error) return console.log(error)
    db = client.db('beta_db');

    app.listen(process.env.PORT, ()=>{
        console.log('listening on 8080')
    });
});

app.use(bodyParser.urlencoded({extended : true }));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.set('view engine', 'ejs');
app.use('/',require('./routes/route.js'));


// app.get('/',(request, response)=>{
//    response.render('index.ejs')
// });

// app.get('/write',(request, response)=>{
//     response.render('write.ejs');
//  });

app.get('/list', (request, response)=>{
    db.collection('posts').find().toArray((error,result)=>{
        console.log(result);
        response.render('list.ejs', {posts: result});
    });
});


 app.post('/add',(request, response)=>{
     response.send('전송완료');
     console.log(request.body);

     db.collection('posts').insertOne({title: request.body.title , date: request.body.date}, (error, result)=>{
         console.log('저장완료');
     });
 });