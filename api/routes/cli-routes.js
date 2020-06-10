const express = require('express');
const router = express.Router();

// Importação do controller (clientes)
const CliController = require("../controllers/cli-controller");
const Cliente = new CliController();
const LogController = require("../controllers/log-controller");
const Access = new LogController();

class Routes {
    Routes(req, res){
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
    }
}

module.exports = Routes;
