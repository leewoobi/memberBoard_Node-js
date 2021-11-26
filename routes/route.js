var router = require('express').Router();
const {ObjectId} = require('mongodb');
function loginCheck(req,res,next){
  if(req.user){
      next();
  }else{
    res.send('로그인 해주세요')
  }
}

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
router.get('/chat', (req,res)=>{
  req.app.db.collection('chatroom').find({member : req.user._id.toString() }).toArray().then((result1)=>{
    var users =  req.user._id.toString(); 
   
    for ( var i = 0;  i < result1.length; i++){
    
    var chatList = result1[i].member  ; 
    
    var chatTitle =  chatList.find((e,i,a)=>{ 
                  
                 
                  console.log( chatList[0])
                  console.log( users,'das')
                 return chatList[i] !== users  
        
             });
           
         break;  
    }
    console.log(chatTitle, '뭐가나왔니')
    req.app.db.collection('member').findOne({_id:ObjectId(chatTitle)},(error,result2)=>{
      if(error) {console.log(error)}
      console.log(result1,'채팅방 목록')
      console.log(result2, '상대유저정보')
      res.render('chat.ejs', {data: result1, data2: result2, user: req.user});

     })
    //  res.render('chat.ejs', {data: result1, user: req.user});
  })
})


 
module.exports = router;