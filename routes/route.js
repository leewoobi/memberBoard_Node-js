var router = require('express').Router();

router.get('/',(req,res)=>{
   console.log(req.user);
    res.render('index.ejs',{user : req.user})
 });

router.get('/write',(req,res)=>{
    res.render('write.ejs',{user : req.user});
  });

  
router.get('/login',(req,res)=>{
    res.render('login.ejs',{user : req.user});
  });

router.get('/mypage',loginCheck, (req,res)=>{
    res.render('mypage.ejs', {user : req.user});
  });

router.get('/signup',(req,res)=>{
    res.render('signUp.ejs',{user : req.user});
  });


 router.get('/edit/:id',(req,res)=>{
   req.app.db.collection('posts').findOne({_id : parseInt(req.params.id)},(error,result)=>{
    res.render('edit.ejs', {data : result});
   });
 
});

// router.get('/list',(req,res)=>{

//   var result = req.app.db.collection('posts').find().toArray((error,result)=>  result )
  
//   res.render('list.ejs', {posts: result},{user: req.user});
// });


  router.get('/list',(req,res)=>{
    req.app.db.collection('posts').find().toArray((error,result)=>{
        res.render('list.ejs', {posts: result},{user: req.user});
     });
 });

 


  router.get('/detail/:id', (req,res)=>{
    req.app.db.collection('posts').findOne({_id :parseInt(req.params.id)},(error,result)=>{
          console.log(result);
          res.render('detail.ejs',{ data : result},{user : req.user});
      })

  })


  function loginCheck(req,res,next){
    if(req.user){
      next()
    } else{
      res.send('로그인 하세요')
    }
  }
  
  

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  
  
 
module.exports = router;