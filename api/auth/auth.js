const jwt = require('jsonwebtoken'); 

 async function Auth(req, res, next) {
  const { token } = req.params;

  await jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      res.redirect('/')
    }else{    
      console.log('Passou no auth!')    
      return next();
    }
  });  
}

module.exports = Auth;
