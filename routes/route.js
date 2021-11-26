var router = require('express').Router();
const { ObjectID } = require('bson');
const e = require('connect-flash');
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
    console.log(result1);
    var users =  req.user._id.toString(); 
    var chatTitle = [];
    for ( var i = 0;  i < result1.length; i++){
    var chatList = result1[i].member  ;
    
    chatTitle.push(chatList.find((e,index,a)=> chatList[index] !== users ))
    
    }
    chatTitle = chatTitle.map(i=> ObjectID(i));
    
    
    req.app.db.collection('member').find({_id : {$in : chatTitle}}).toArray((error,result2)=>{
      if(error) {console.log(error)}
      var titleList = [];
      for ( var a = 0;  a < result1.length; a++ ){
        for ( var b = 0;  b < result1.length; b++  ){
         console.log(result2,'이거 결과2')
          var  boardInfo = result1[a].member;
          var  userInfo = result2[b]._id.toString(); 
          var  rs = boardInfo.find((e,i)=> boardInfo[i] == userInfo )
     
        
          if(rs !== undefined){
            titleList.push(rs);
            if (titleList.length !== 0){
  
              result1[a].name = result2[b].name 
            
            }
          }             
        }      
      }
      res.render('chat.ejs', {data: result1, user: req.user});
    })
  })
})





 
module.exports = router;