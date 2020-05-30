const jwt = require('jsonwebtoken');
const express = require('express');       
const bodyParser = require('body-parser');
const app = express();  
const port = 3000; //porta padrão
const mysql = require('mysql');
const cors = require('cors');
const router = express.Router();
var dataset = undefined
require("dotenv-safe").config();

//libera acesso CORS para qualquer domínio
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});

//inicia o servidor
app.listen(port);
console.log('API inicializada corretamente!');

//verifica token no HEADERS
function verifyJWT(req, res, next){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'Nenhum token encontrado.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Falha ao autenticar token.' });
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

//configurando o BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //para usar quando vem de um FORM
app.use('/', router);
app.set('view engine', 'ejs');
app.use(express.static('public'));

// router.js

//Rota de AUTENTICAÇÃO e geração do token JWT
app.post('/login', (req, res, next) => {    
  if(req.body.user === 'monteiro@gmail.com' && req.body.pwd === '12345'){
    //auth ok    
    const id = 1; //esse id viria do banco de dados
    var token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 3600 // expires in 60min      
    });
    //console.log(token);
    res.status(200).json({ auth: true, token: token }); 
  } else {
    res.status(500).send({ auth: false, token: 'Login inválido!' });
    //Chamar template de LOGIN INVÁLIDO!
  } 
});

app.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});


//Rota GET para a página HOME
router.get('/admin/:token', (req, res) => {
  const { token } = req.params
  let user = '';   
  
  jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      //res.send(err.message)
      res.redirect('/')
    }else{
      res.render('admin', {
        token:token,
        user:user
      });
    }
  });
});

//Rota GET para listagem dos CLIENTES
router.get('/clientes/:token/:id?', (req, res) =>{
    const { token } = req.params;
    const id = parseInt(req.params.id);
    let filter = '';
    let nome = null;
    let acao = null;

    if(req.params.id) filter = ' AND ID=' + id;

    jwt.verify(token, process.env.SECRET, (err) => {
      if(err){
        //res.send(err.message)
          res.redirect('/')
      }else{        
        execSQLQuery('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
          //console.log(dataset);
          res.render('clientes', {
            token:token,
            clientes:dataset,
            nome:nome,
            acao:acao
          });          
        });                 
      }
    })
});

//Rota GET para CREATE de CLIENTE
router.get('/cliente/include/:token', (req, res) =>{
  const { token } = req.params;
  const id = parseInt(req.params.id);
  let cliente = '';

  jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      //res.send(err.message)
        res.redirect('/')
    }else{        
      res.render('cli-include', {
        id:id,
        token:token,
        cliente:cliente
      }); 
    }
  });
});

//Rota POST para CREATE de CLIENTE
router.post('/clientes/:token/', (req, res) =>{
  const { token } = req.params;
  const acao = 'CADASTRADO';
  const cus_nome = req.body.cus_nome.substring(0,50);
  const cus_end = req.body.cus_end.substring(0,100);
  const cus_email = req.body.cus_email.substring(0,50);
  const cus_tel1 = req.body.cus_tel1.substring(0,11);
  const cus_tel2 = req.body.cus_tel2.substring(0,11);

  jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      //res.send(err.message)
        res.redirect('/')
    }else{        
      execSQLQuery(`INSERT INTO clientes(nome, endereco, email, celular, telefone, flagstatus) VALUES('${cus_nome}','${cus_end}','${cus_email}','${cus_tel1}','${cus_tel2}', 1)`, (dataset) => {
        dataset = '';
        execSQLQuery('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
          let nreg = parseInt(dataset.length);
          const nome = dataset[nreg -1].Nome;
          res.render('clientes', {
            token:token,
            clientes:dataset,
            nome:nome,
            acao:acao
          });          
        });          
      });        
    }
  })
});

//Rota GET para DELETE de CLIENTE
router.get('/cliente/delete/:token/:id', (req, res) =>{
  const { token } = req.params;
  const id = parseInt(req.params.id);
  var cus_nome = "";
  var cus_end = "";
  var cus_email = "";
  var cus_tel1 = "";
  var cus_tel2 = "";

  jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      //res.send(err.message)
        res.redirect('/')
    }else{    
      
      dataset = '';
      execSQLQuery(`SELECT nome, endereco, email, celular, telefone FROM clientes WHERE id=${id}` , (dataset) => {      
      //let nome = JSON.stringify(dataset);
      //console.log('O nome é: ' + nome);
      dataset.forEach(function(el, i){
        if(el.Id = id) {
          cliente = el.nome;
          end = el.endereco;
          email = el.email;
          tel1 = el.celular;
          tel2 = el.telefone
        }        
      });  
        res.render('cli-delete', {
          id:id,
          token:token,
          cliente:cliente,
          endereco:end,
          email:email,
          celular:tel1,
          telefone:tel2
        }); 
      });
    }
  });
});

//Rota POST para DELETE de CLIENTE
router.post('/cliente/delete/:token/:id', (req, res) =>{
  const { token } = req.params;
  const acao = 'EXCLUÍDO';
  const id = parseInt(req.params.id);
  let nome = "";
  console.log('Rota POST para DELETE de CLIENTE');
  jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      //res.send(err.message)
        res.redirect('/')
    }else{    
      
      dataset = '';
      execSQLQuery(`SELECT nome FROM clientes WHERE id=${id}` , (dataset) => {      
      //  let nome = JSON.stringify(dataset);
      //  console.log('O nome é: ' + nome);
      dataset.forEach(function(el, i){
        if(el.Id = id) {
          nome = el.nome;
        }
      });
        
        dataset = '';
        execSQLQuery(`UPDATE clientes SET FlagStatus=0 WHERE ID=${id}`, (dataset) => {
          //console.log(dataset);
          
          dataset = '';
          execSQLQuery('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
            //let nreg = parseInt(dataset.length);
            //const nome = dataset[nreg -1].Nome;
            res.render('clientes', {
              token:token,
              clientes:dataset,
              nome:nome,
              acao:acao
            });          
          });
        });
      });
    }
  });
});

//Rota GET para UPDATE de CLIENTE
router.get('/cliente/update/:token/:id', (req, res) =>{
  const { token } = req.params;
  const id = parseInt(req.params.id);
  var cus_nome = "";
  var cus_end = "";
  var cus_email = "";
  var cus_tel1 = "";
  var cus_tel2 = "";

  jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      //res.send(err.message)
        res.redirect('/')
    }else{    
      
      dataset = '';
      execSQLQuery(`SELECT nome, endereco, email, celular, telefone FROM clientes WHERE id=${id}` , (dataset) => {      
      //let nome = JSON.stringify(dataset);
      //console.log('O nome é: ' + nome);
      dataset.forEach(function(el, i){
        if(el.Id = id) {
          cliente = el.nome;
          end = el.endereco;
          email = el.email;
          tel1 = el.celular;
          tel2 = el.telefone
        }        
      });  
        res.render('cli-edit', {
          id:id,
          token:token,
          cliente:cliente,
          endereco:end,
          email:email,
          celular:tel1,
          telefone:tel2
        }); 
      });
    }
  });
});

//Rota POST para UPDATE de CLIENTE
router.post('/cliente/update/:token/:id', (req, res) =>{
  const { token } = req.params;
  const id = parseInt(req.params.id);
  const acao = 'ATUALIZADO';
  const cus_nome = req.body.cus_nome.substring(0,50);
  const cus_end = req.body.cus_end.substring(0,100);
  const cus_email = req.body.cus_email.substring(0,50);
  const cus_tel1 = req.body.cus_tel1.substring(0,11);
  const cus_tel2 = req.body.cus_tel2.substring(0,11);
  
  jwt.verify(token, process.env.SECRET, (err) => {
    if(err){
      //res.send(err.message)
        res.redirect('/')
    }else{  
        
        dataset = '';
        execSQLQuery(`UPDATE clientes SET nome='${cus_nome}', endereco='${cus_end}', email='${cus_email}', celular='${cus_tel1}', telefone='${cus_tel2}' WHERE ID=${id}`, (dataset) => {
          console.log(dataset);
          
        dataset = '';
        execSQLQuery('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
          //let nreg = parseInt(dataset.length);
          //const nome = dataset[nreg -1].Nome;
          res.render('clientes', {            
            token:token,
            clientes:dataset,
            nome:cus_nome,
            acao:acao
          });          
        });
      });
    }
  });
});

// mysql.js 

function execSQLQuery(sqlQry, callback){
  const connection = mysql.createConnection({
    host: 'mysql942.umbler.com',
    port: '41890',
    user: 'prmpoker',
    password: 'stuunga1980',
    database: 'nodejsbd'
  });

  connection.query(sqlQry, function(error, results, fields){
    let dataset = '';
    
    if(error) 
      console.log(error);
    else
      dataset = results;
      //console.log(dataset);
      connection.end();
      //console.log('Executou conexão com DB:');
      return callback(dataset);
  });
}