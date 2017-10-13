var express = require('express');
var router = express.Router();
var connection=require('../utils/mysql');
var crypto=require('../utils/hash-salt');
var multer  = require('multer');
var csv = require('csv');


//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname  )
  }
});
var upload = multer({ storage: storage })



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
   res.render('signup');
});

//post routes

  router.post('/signup',(req,res)=>{
      
    console.log(req.body);
        
        var user={
          name:req.body.name,
          email:req.body.email,
          password:req.body.psw
        };

      Object.assign(user, crypto.createHash(user.password));
      // console.log(user);
      connection.query('INSERT INTO users SET ?', user,function(error,results) {
          if (error) {
              console.log(error.message);
          } else {
            console.log('inserted id:'+results.insertId);  
            res.redirect('/');  
          }
        
      });

            
  });

    router.post('/login',(req,res)=>{          
          console.log(req.body);        
        connection.query(`SELECT * FROM users  WHERE name like '${req.body.uname}'`,function(error,result) {
          if (error) {
              console.log(error.message);
          } else {
            if(result.length>0){
              if(crypto.validate(result[0].password,result[0].salt,req.body.psw)){
                console.log('password success'); 
                

                    // res.cookie('access_token',result[0].token, {httpOnly: true}).status(301).render('profile',{image:result[0].image,name:result[0].name,email:result[0].email});
                res.render('profile',{name:result[0].name});

                
            
              }else{
                console.log('password did not match');
                res.json({
                    status:false,                  
                    message:"Email and password does not match"
                    });
              }
            }else{
              console.log('register first');
              res.json({
                status:false,
              message:"User does not exits"
            });
            }   
          } 
        });
    })

    router.post('/itemSave',upload.any(),(req,res)=>{
      // console.log(req.body);
       //console.log(req.files);
      
       var images=``;
       for(var i=0;i<req.files.length;i++){    
         images += req.files[i].originalname+`,`;
       }
       console.log(images);
       var user ={
         Title:req.body.title,
          name:req.body.name,
          category:req.body.category,
          images:images
       }

       connection.query('INSERT INTO item SET ?', user,function(error,results) {
              if (error) {
                  console.log(error.message);
              } else {
                console.log('inserted item:'+results.insertId);  
                res.send(req.body);  
              }      
       }); 
    })

    router.post('/SearchFilter',(req,res)=>{
          console.log(req.body);        

          connection.query(`SELECT * FROM item  WHERE name like '${req.body.name}' AND category like '${req.body.category}';`,function(error,result) {
            if (error) {
                console.log(error.message);
            } else {
              console.log(result);
              if(result.length>0){
                var img=``;
                for(var a=0;a<result.length;a++){
                   img +=result[a].images+'';
                }
                console.log(img);
                csv.parse(img, function(err, data){
                  csv.transform(data, function(data){                  
                            res.send({
                              data,
                              status:true});                                 
                   })
               })
              }
              else{
                res.send({
                  status:false
                });
              }
               
                  
            }
          });           
    })

    router.post('/SearchItem',(req,res)=>{
      console.log(req.body); 
      var out=[];
      connection.query(`SELECT * FROM item  WHERE name like '${req.body.name}' ;`,function(error,result) {
        if (error) {
            console.log(error.message);
        } else {
          console.log(result.length);

          for(var i=0;i<result.length;i++){
            csv.parse(result[i].images, function(err, data){
              csv.transform(data, function(data){                  
                   out.push(data);
                   if(out.length==result.length){
                     res.send({out,result});
                   }                                   
               })
           })
           
          }
          
          }
      })
         
    } )



module.exports = router;
