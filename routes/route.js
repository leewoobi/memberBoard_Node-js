var router = require('express').Router();

router.get('/',(request, response)=>{
    response.render('index.ejs')
 });
 
 router.get('/write',(request, response)=>{
     response.render('write.ejs');
  });
 
//   router.get('/list', (request, response)=>{
//      db.collection('posts').find().toArray((error,result)=>{
//          console.log(result);
//          response.render('list.ejs', {posts: result});
//      });
//  });

module.exports = router;