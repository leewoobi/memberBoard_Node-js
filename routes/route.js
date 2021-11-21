var router = require('express').Router();



router.get('/',(req,res)=>{
    res.render('index.ejs')
 });
 
 router.get('/write',(req,res)=>{
    res.render('write.ejs');
  });

 router.get('/edit/:id',(req,res)=>{
   req.app.db.collection('posts').findOne({_id : parseInt(req.params.id)},(error,result)=>{

    res.render('edit.ejs', {data : result});
   });
 
});
 
  router.get('/list', (req,res)=>{
    req.app.db.collection('posts').find().toArray((error,result)=>{
        //  console.log(result);
        res.render('list.ejs', {posts: result});
     });
 });


  router.get('/detail/:id',(req,res)=>{
    req.app.db.collection('posts').findOne({_id :parseInt(req.params.id)},(error,result)=>{
          console.log(result);
          res.render('detail.ejs',{ data : result});
      })

  })

 
module.exports = router;