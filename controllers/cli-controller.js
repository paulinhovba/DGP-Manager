const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();


class CliController {

    GetListaClientes(req, res) {
        const {token} = req.params;
        const id = parseInt(req.params.id);
        let filter = '';
        let nome = null;
        let acao = null;
        const host = process.env.HOST;

        if (req.params.id) filter = ' AND ID=' + id;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {

                SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1 ORDER BY nome', (dataset) => {
                    //console.log(dataset);
                    res.render('clientes', {
                        host: host,
                        token: token,
                        clientes: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'cli'
                    });
                });
            }
        })
    }

    GetCadastraCliente(req, res) {
        const {token} = req.params;
        const id = parseInt(req.params.id);
        let cliente = '';
        const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                res.render('cli-include', {
                    host: host,
                    id: id,
                    token: token,
                    cliente: cliente,
                    section: 'cli'
                });
            }
        })
    }

    PostCadastraClientes(req, res) {
        const {token} = req.params;
        const acao = 'CADASTRADO';
        const cus_nome = req.body.cus_nome;
        const cus_end = req.body.cus_end;
        const cus_email = req.body.cus_email;
        const cus_tipo = req.body.cus_tipo;
        const cus_tel1 = req.body.cus_tel1;
        const cus_tel2 = req.body.cus_tel2;
        const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`INSERT INTO clientes(nome, endereco, email, tipo, celular, telefone, flagstatus) VALUES('${cus_nome}','${cus_end}','${cus_email}','${cus_tipo}','${cus_tel1}','${cus_tel2}', 1)`, (dataset) => {
                    dataset = '';
                    SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1 ORDER BY nome', (dataset) => {
                        res.render('clientes', {
                            host: host,
                            token: token,
                            clientes: dataset,
                            nome: cus_nome,
                            acao: acao,
                            section: 'cli'
                        });
                    });
                });
            }
        })
    }

    GetDeletaCliente(req, res) {
        const {token} = req.params;
        const id = parseInt(req.params.id);
        let cliente = '';
        let end = '';
        let email = '';
        let tipo = '';
        let tel1 = '';
        let tel2 = '';
        const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
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
                        host: host,
                        id: id,
                        token: token,
                        cliente: cliente,
                        endereco: end,
                        email: email,
                        tipo: tipo,
                        celular: tel1,
                        telefone: tel2,
                        section: 'cli'
                    });
                });
            }
        });
    }

    PostDeletaCliente(req, res) {
        const {token} = req.params;
        const acao = 'EXCLUÍDO';
        const id = parseInt(req.params.id);
        let nome = "";
        const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {

                SQL.Query(`SELECT nome FROM clientes WHERE id=${id}`, (dataset) => {
                    //  let nome = JSON.stringify(dataset);
                    //  console.log('O nome é: ' + nome);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.nome;
                        }

                        SQL.Query(`UPDATE clientes SET FlagStatus=0 WHERE ID=${id}`, (dataset) => {

                            SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1 ORDER BY nome', (dataset) => {
                                //let nreg = parseInt(dataset.length);
                                //const nome = dataset[nreg -1].Nome;
                                res.render('clientes', {
                                    host: host,
                                    token: token,
                                    clientes: dataset,
                                    nome: nome,
                                    acao: acao,
                                    section: 'cli'
                                });
                            });
                        });
                    });
                })
            }
        })
    }

    GetAtualizaCliente(req, res) {
        const {token} = req.params;
        const id = parseInt(req.params.id);
        let cliente = '';
        let end = '';
        let email = '';
        let tipo = '';
        let tel1 = '';
        let tel2 = '';
        const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {

                SQL.Query(`SELECT nome, endereco, email, tipo, celular, telefone FROM clientes WHERE id=${id}`, (dataset) => {
                    let nome = JSON.stringify(dataset);
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
                        host: host,
                        id: id,
                        token: token,
                        cliente: cliente,
                        endereco: end,
                        email: email,
                        tipo: tipo,
                        celular: tel1,
                        telefone: tel2,
                        section: 'cli'
                    });
                });
            }
        });
    }

    PostAtualizaCliente(req, res) {
        const {token} = req.params;
        const id = parseInt(req.params.id);
        const acao = 'ATUALIZADO';
        const cus_nome = req.body.cus_nome;
        const cus_end = req.body.cus_end;
        const cus_email = req.body.cus_email;
        const cus_tipo = req.body.cus_tipo;
        const cus_tel1 = req.body.cus_tel1;
        const cus_tel2 = req.body.cus_tel2;
        const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`UPDATE clientes SET nome='${cus_nome}', endereco='${cus_end}', email='${cus_email}', tipo='${cus_tipo}', celular='${cus_tel1}', telefone='${cus_tel2}' WHERE ID=${id}`, (dataset) => {
                    SQL.Query('SELECT * FROM clientes WHERE FlagStatus=1 ORDER BY nome', (dataset) => {
                        res.render('clientes', {
                            host: host,
                            token: token,
                            clientes: dataset,
                            nome: cus_nome,
                            acao: acao,
                            section: 'cli'
                        });
                    });
                });
            }
        });
    }

    GetListaAdmin(req, res) {
        const {token} = req.params
        let user = '';
        let totaldeb = '';
        let totalcrd = '';
        let totalemp = '';
        let totalempvd = '';
        let totallot = '';
        let totallotvd = '';
        let totalcot = '';
        let totalcotvd = '';
        let saldo = '';
        let tipo ='';
        let acao = '';
        const host = process.env.HOST;

        let groupQuery =`SELECT CONCAT('R$ ', FORMAT(total_debito, 2, 'de_DE'))
                                    AS "total_debito",
                                CONCAT('R$ ', FORMAT(total_credito, 2, 'de_DE'))
                                    AS "total_credito",
                                CONCAT('R$ ', FORMAT(abs(total_debito - total_credito), 2, 'de_DE'))
                                    AS "saldo",
                                (CASE
                                    WHEN total_debito > total_credito THEN 'Negativo'
                                    ELSE 'Positivo'
                                END)
                                    tp
                            FROM (SELECT sum(CASE WHEN tipo = 'S' THEN valor ELSE 0 END) total_debito,
                                    sum(CASE WHEN tipo = 'E' THEN valor ELSE 0 END) total_credito
                                FROM (SELECT lct.id,
                                            lct.descricao,
                                            DATE_FORMAT(lct.data, '%d/%m/%Y') AS "data",
                                            lct.tipo,
                                            lct.valor,
                                            emp.descricao AS "empreendimento",
                                            con.descricao AS "conta"
                                    FROM empreendimentos emp, contas con, lancamentos lct
                                    WHERE     lct.idconta = con.id
                                            AND lct.idempreendimento = emp.id
                                            AND lct.idcategoria > 1
                                            AND lct.flagstatus = 1) tab) resultado`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query('SELECT COUNT(id) as "totalemp" FROM empreendimentos emp WHERE FlagStatus=1', (dataset) => {                
                    dataset.forEach(function(el, i) {
                        totalemp = el.totalemp;
                    });
                    SQL.Query('SELECT COUNT(id) as "totalempvd" FROM empreendimentos emp WHERE FlagStatus=0', (dataset) => {                
                        dataset.forEach(function(el, i) {
                            totalempvd = el.totalempvd;
                        });
                        SQL.Query('SELECT COUNT(*) as "totallot" FROM lotes WHERE FlagStatus=1', (dataset) => {                
                            dataset.forEach(function(el, i) {
                                totallot = el.totallot;
                            });
                            SQL.Query('SELECT COUNT(*) as "totallotvd" FROM lotes WHERE FlagStatus=0', (dataset) => {                
                                dataset.forEach(function(el, i) {
                                    totallotvd = el.totallotvd;
                                });
                                SQL.Query('SELECT COUNT(*) as "totalcot" FROM cotas WHERE FlagStatus=1', (dataset) => {                
                                    dataset.forEach(function(el, i) {
                                        totalcot = el.totalcot;
                                    });
                                    SQL.Query('SELECT COUNT(*) as "totalcotvd" FROM cotas WHERE FlagStatus=0', (dataset) => {                
                                        dataset.forEach(function(el, i) {
                                            totalcotvd = el.totalcotvd;
                                        });      
                                        SQL.Query(groupQuery, (dataset) => { 
                                            dataset.forEach(function(el, i) {
                                                totaldeb = el.total_debito;
                                                totalcrd = el.total_credito;
                                                saldo = el.saldo;
                                                tipo = el.tp;
                                            });                   
                                            res.render('admin', {
                                                host: host,
                                                token: token,
                                                user: user,
                                                totaldeb: totaldeb,
                                                totalcrd: totalcrd,
                                                totalemp: totalemp,
                                                totalempvd: totalempvd,
                                                totallot: totallot,
                                                totallotvd: totallotvd,
                                                totalcot: totalcot,
                                                totalcotvd: totalcotvd,
                                                saldo: saldo,
                                                tipo: tipo,
                                                acao: acao,
                                                section: 'adm',
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    }
}

module.exports = CliController;