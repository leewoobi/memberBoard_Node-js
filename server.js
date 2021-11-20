const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true }));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


app.listen(8080, ()=>{
    console.log('listening on 8080')
});

app.get('/',(request, response)=>{
   response.sendFile(__dirname + '/index.html')
});

app.get('/write',(request, response)=>{
    response.sendFile(__dirname + '/pages/write.html')
 });

 app.post('/add',(request, response)=>{
     response.send('전송완료');
     console.log(request.body);
 });