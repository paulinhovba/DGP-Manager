const jwt = require('jsonwebtoken');
var dataset = undefined

require("dotenv-safe").config();

const execQuery = require("../database/database");
const SQL = new execQuery();

class CliController {

    GetCadastraCliente(req, res) {
        if (TestToken) {
            const id = parseInt(req.params.id);
            let cliente = '';

            res.render('cli-include', {
                id: id,
                token: token,
                cliente: cliente
            });
        }
    }

    PostCadastraClientes(req, res) {
        if (TestToken) {
            const acao = 'CADASTRADO';
            const cus_nome = req.body.cus_nome.substring(0, 50);
            const cus_end = req.body.cus_end.substring(0, 100);
            const cus_email = req.body.cus_email.substring(0, 50);
            const cus_tipo = req.body.cus_tipo;
            const cus_tel1 = req.body.cus_tel1.substring(0, 11);
            const cus_tel2 = req.body.cus_tel2.substring(0, 11);

            SQL.Query(`INSERT INTO clientes(nome, endereco, email, tipo, celular, telefone, flagstatus) VALUES('${cus_nome}','${cus_end}','${cus_email}','${cus_tipo}','${cus_tel1}','${cus_tel2}', 1)`, (dataset) => {
                dataset = '';
                SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
                    let nreg = parseInt(dataset.length);
                    const nome = dataset[nreg - 1].Nome;
                    res.render('clientes', {
                        token: token,
                        clientes: dataset,
                        nome: nome,
                        acao: acao
                    });
                });
            });
        }
    }

    GetDeletaCliente(req, res) {
        if (TestToken) {

            const id = parseInt(req.params.id);
            let cliente = '';
            let end = '';
            let email = '';
            let tipo = '';
            let tel1 = '';
            let tel2 = '';

            SQL.Query(`SELECT nome, endereco, email, tipo , celular, telefone FROM clientes WHERE id=${id}`, (dataset) => {

                dataset.forEach(function(el, i) {
                    if (el.Id = id) {
                        cliente = el.nome;
                        end = el.endereco;
                        email = el.email;
                        tipo = el.tipo;
                        tel1 = el.celular;
                        tel2 = el.telefone
                    }
                });
                res.render('cli-delete', {
                    id: id,
                    token: token,
                    cliente: cliente,
                    endereco: end,
                    email: email,
                    tipo: tipo,
                    celular: tel1,
                    telefone: tel2
                });
            });
        }
    }

    PostDeletaCliente(req, res) {
        if (TestToken) {
            const acao = 'EXCLUÍDO';
            const id = parseInt(req.params.id);
            let nome = "";
            SQL.Query(`SELECT nome FROM clientes WHERE id=${id}`, (dataset) => {
                //  let nome = JSON.stringify(dataset);
                //  console.log('O nome é: ' + nome);
                dataset.forEach(function(el, i) {
                    if (el.Id = id) {
                        nome = el.nome;
                    }
                });
                dataset = '';
                SQL.Query(`UPDATE clientes SET FlagStatus=0 WHERE ID=${id}`, (dataset) => {

                    dataset = '';
                    SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
                        //let nreg = parseInt(dataset.length);
                        //const nome = dataset[nreg -1].Nome;
                        res.render('clientes', {
                            token: token,
                            clientes: dataset,
                            nome: nome,
                            acao: acao
                        });
                    });
                });
            });
        }
    }

    GetAtualizaCliente(req, res) {
        if (TestToken) {
            const id = parseInt(req.params.id);
            let cliente = '';
            let end = '';
            let email = '';
            let tipo = '';
            let tel1 = '';
            let tel2 = '';

            SQL.Query(`SELECT nome, endereco, email, tipo, celular, telefone FROM clientes WHERE id=${id}`, (dataset) => {
                //let nome = JSON.stringify(dataset);
                //console.log('O nome é: ' + nome);
                dataset.forEach(function(el, i) {
                    if (el.Id = id) {
                        cliente = el.nome;
                        end = el.endereco;
                        email = el.email;
                        tipo = el.tipo;
                        tel1 = el.celular;
                        tel2 = el.telefone
                    }
                });
                res.render('cli-edit', {
                    id: id,
                    token: token,
                    cliente: cliente,
                    endereco: end,
                    email: email,
                    tipo: tipo,
                    celular: tel1,
                    telefone: tel2
                });
            });
        }
    }

    PostAtualizaCliente(req, res) {
        if (TestToken) {
            const id = parseInt(req.params.id);
            const acao = 'ATUALIZADO';
            const cus_nome = req.body.cus_nome.substring(0, 50);
            const cus_end = req.body.cus_end.substring(0, 100);
            const cus_email = req.body.cus_email.substring(0, 50);
            const cus_tipo = req.body.cus_tipo.substring(0, 20);
            const cus_tel1 = req.body.cus_tel1.substring(0, 11);
            const cus_tel2 = req.body.cus_tel2.substring(0, 11);

            SQL.Query(`UPDATE clientes SET nome='${cus_nome}', endereco='${cus_end}', email='${cus_email}', tipo='${cus_tipo}', celular='${cus_tel1}', telefone='${cus_tel2}' WHERE ID=${id}`, (dataset) => {
                SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
                    res.render('clientes', {
                        token: token,
                        clientes: dataset,
                        nome: cus_nome,
                        acao: acao
                    });
                });
            });
        }
    }

    GetListaClientes(req, res) {

        if (TestToken) {
            const id = parseInt(req.params.id);
            let filter = '';
            let nome = null;
            let acao = null;

            if (req.params.id) filter = ' AND ID=' + id;

            SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1', (dataset) => {
                //console.log(dataset);
                res.render('clientes', {
                    token: token,
                    clientes: dataset,
                    nome: nome,
                    acao: acao
                });
            });
        }
    }

    GetListaAdmin(req, res) {
        if (TestToken) {
            res.render('admin', {
                token: token,
                user: user
            });
        }
    }

    TestToken(req, res, next) {
        const {
            token
        } = req.params
        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                next;
            }
        });
    }

}

module.exports = CliController;