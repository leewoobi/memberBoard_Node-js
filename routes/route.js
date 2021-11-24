var router = require('express').Router();

router.get('/',(req,res)=>{
    res.render('index.ejs',{user : req.user})
 });

router.get('/write',(req,res)=>{
    res.render('write.ejs',{user : req.user});
  });

router.get('/login',(req,res)=>{
    res.render('login.ejs',{user : req.user});
  });

router.get('/signup',(req,res)=>{
    res.render('signUp.ejs',{user : req.user});
  });

 router.get('/edit/:id',(req,res)=>{
   req.app.db.collection('posts').findOne({_id : parseInt(req.params.id)},(error,result)=>{
    res.render('edit.ejs', {data : result, user : req.user});
   });
 
});

router.get('/list',(req,res)=>{
  req.app.db.collection('posts').find().toArray((error,result)=>{
    // console.log(result, req.user)
    res.render('list.ejs', {posts: result, user: req.user});
 });
})

router.get('/search',(req,res)=>{
  var seachCon = [
    {
      $search: {
        index: 'titleSearch',
        text: {
          query: req.query.value,
          path: 'title'  // 제목, 날짜 둘다 찾고 싶으면 ['title', 'date']
        }
      }
    },
    {$sort : {_id : 1}},
    // {$limit : 10} 갯수 제한
  ] 
  req.app.db.collection('posts').aggregate(seachCon).toArray((error,result)=>{
    // console.log(result);
    res.render('searchRes.ejs', {posts: result , user: req.user});
  })
})
  
 
module.exports = router;