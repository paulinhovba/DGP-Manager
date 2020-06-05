const jwt = require('jsonwebtoken'); 
require("dotenv-safe").config();

class GenController {

  PostUserToken(req, res){
    if(req.body.user === process.env.USER && req.body.pwd === process.env.PASS){
      //auth ok    
      const id = 1; //esse id viria do banco de dados
      var token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 3600 // expires in 60min      
      });
      res.status(200).json({ auth: true, token: token }); 
    } else {
      res.status(500).send({ auth: false, token: 'Login inválido!' });
      //Chamar template de LOGIN INVÁLIDO!
    } 
  }

PostUserLogout(req, res){
  res.status(200).send({ auth: false, token: null });
}

}

module.exports = GenController;