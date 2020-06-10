const express = require('express');       
const bodyParser = require('body-parser');
const app = express();  
const port = 3000; //porta padrão
const cors = require('cors');
const router = express.Router();


// Importação do controller (clientes)
const CliController = require("./controllers/cli-controller");
const Cliente = new CliController();
const LogController = require("./controllers/log-controller");
const Access = new LogController();


// Libera acesso CORS para qualquer domínio. Substituir * pelo domínio desejado.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});


//configurando o BODYPARSER, ROUTER, EJS e STATIC ROUTE.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //para usar quando vem de um FORM
app.use('/', router);
app.set('view engine', 'ejs');
app.use(express.static('public'));
//app.use(verifyJWT);


// Controle de Rotas (CLIENTES)
router.post('/login', Access.PostUserToken)
router.get('/admin/:token', Cliente.GetListaAdmin)
router.get('/clientes/:token/:id?', Cliente.GetListaClientes)
router.get('/cliente/include/:token', Cliente.GetCadastraCliente)
router.post('/clientes/:token/', Cliente.PostCadastraClientes)
router.get('/cliente/delete/:token/:id', Cliente.GetDeletaCliente)
router.post('/cliente/delete/:token/:id', Cliente.PostDeletaCliente)
router.get('/cliente/update/:token/:id', Cliente.GetAtualizaCliente)
router.post('/cliente/update/:token/:id', Cliente.PostAtualizaCliente)
router.get('/logout', Access.PostUserLogout)


//inicia o servidor
app.listen(port, ()=> {console.log(`API rodando na porta ${port}`)})