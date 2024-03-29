const jwt = require('jsonwebtoken');
require("dotenv-safe").config();


class LogController {
    PostUserToken(req, res) {

        if (req.body.user === process.env.USER && req.body.pwd === process.env.PASS) {
            //auth ok    
            const user = req.body.user; 
            var token = jwt.sign({
              user
            }, process.env.SECRET, {
                expiresIn: 3600 // expires in 60min
            });
            
            res.status(200).json({
                auth: true,
                token: token 
            });
            
        } else {
            res.status(500).send({
                auth: false,
                token: 'Login inválido!'
            });
            //Chamar template de LOGIN INVÁLIDO!
        }
    }

    PostUserLogout(req, res) {
        res.status(200).send({
            auth: false,
            token: null
        });

    }

}



module.exports = LogController;