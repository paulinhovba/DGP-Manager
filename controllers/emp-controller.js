const jwt = require('jsonwebtoken'); 
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class EmpController {

    GetListaEmpreendimentos(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;

        if (req.params.id) filter = ' AND ID=' + id;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query('SELECT Id, DATE_FORMAT(DataLancamento, "%d/%m/%Y") AS DataLancamento, Descricao, Localizacao, QuantidadeCotas FROM empreendimentos WHERE FlagStatus=1 ORDER BY Descricao', (dataset) => {
                    //console.log(dataset);
                    res.render('empreendimentos', {
                        host: host,
                        token: token,
                        empreendimentos: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'emp'
                    });
                });
            }
        })
    }

    GetCadastraEmpreendimento(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let empreendimento = '';

        res.render('emp-include', {
            host: host,
            id: id,
            token: token,
            empreendimento: empreendimento,
            section: 'emp'
        });
    }

    PostCadastraEmpreendimento(req, res) {
        const {token} = req.params
        const acao = 'CADASTRADO';
        const emp_dt_lcto = dateToEN(req.body.emp_dt_lcto);
        const emp_descricao = req.body.emp_descricao;
        const emp_localizacao = req.body.emp_localizacao;
        const emp_cotas = req.body.emp_cotas;
        const host = process.env.HOST;

        //console.log(emp_dt_lcto);

        SQL.Query(`INSERT INTO empreendimentos(DataLancamento, Descricao, Localizacao, Quantidadecotas, FlagStatus) VALUES('${emp_dt_lcto}','${emp_descricao}','${emp_localizacao}','${emp_cotas}', 1)`, (dataset) => {
            dataset = '';
            SQL.Query('SELECT Id, DATE_FORMAT(DataLancamento, "%d/%m/%Y") AS DataLancamento, Descricao, Localizacao, QuantidadeCotas FROM empreendimentos WHERE FlagStatus=1 ORDER BY Descricao', (dataset) => {
                //let nreg = parseInt(dataset.length);
                //const nome = dataset[nreg - 1].Descricao;
                res.render('empreendimentos', {
                    host: host,
                    token: token,
                    empreendimentos: dataset,
                    nome: emp_descricao,
                    acao: acao,
                    section: 'emp'
                });
            });
        });
    }

    GetDeletaEmpreendimento(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let empreendimento = '';
        let localizacao = '';
        let lancamento = '';
        let cotas = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {               
                SQL.Query(`SELECT DATE_FORMAT(DataLancamento, "%d/%m/%Y") AS DataLancamento, Descricao, Localizacao, QuantidadeCotas FROM empreendimentos WHERE id=${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            empreendimento = el.Descricao;
                            localizacao = el.Localizacao;
                            lancamento = el.DataLancamento;
                            cotas = el.QuantidadeCotas
                        }
                    });
                    res.render('emp-delete', {
                        host: host,
                        id: id,
                        token: token,
                        empreendimento: empreendimento,
                        localizacao: localizacao,
                        lancamento: lancamento,
                        cotas: cotas,
                        section: 'emp'
                    });
                });
            }
        });
    }

    PostDeletaEmpreendimento(req, res) {
        const {id, token} = req.params;   
        const acao = 'EXCLUÍDO';
        const host = process.env.HOST;
        let nome = "";

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {      
                SQL.Query(`SELECT Descricao FROM empreendimentos WHERE id=${id}`, (dataset) => {
                    //  let nome = JSON.stringify(dataset);
                    //  console.log('O nome é: ' + nome);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.Descricao;
                        }
                        SQL.Query(`UPDATE empreendimentos SET FlagStatus=0 WHERE ID=${id}`, (dataset) => {
                            SQL.Query('SELECT Id, DATE_FORMAT(DataLancamento, "%d/%m/%Y") AS DataLancamento, Descricao, Localizacao, QuantidadeCotas FROM empreendimentos WHERE FlagStatus=1 ORDER BY Descricao', (dataset) => {
                                //let nreg = parseInt(dataset.length);
                                //const nome = dataset[nreg -1].Nome;
                                res.render('empreendimentos', {
                                    host: host,
                                    token: token,
                                    empreendimentos: dataset,
                                    nome: nome,
                                    acao: acao,
                                    section: 'emp'
                                });
                            });
                        });
                    });
                })
            }
        })
    }

    GetAtualizaEmpreendimento(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let empreendimento = '';
        let localizacao = '';
        let lancamento = '';
        let cotas = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                SQL.Query(`SELECT DATE_FORMAT(DataLancamento, "%d/%m/%Y") AS DataLancamento, Descricao, Localizacao, QuantidadeCotas FROM empreendimentos WHERE id=${id}`, (dataset) => {
                    let nome = JSON.stringify(dataset);
                    //console.log('O nome é: ' + nome);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            empreendimento = el.Descricao;
                            localizacao = el.Localizacao;
                            lancamento = el.DataLancamento;
                            cotas = el.QuantidadeCotas
                        }
                    });

                    //Formatar a DATA do BD para o controle HTML Input Date.
                    let oldData = lancamento.split("/");                        
                    let newData = oldData[2] + "-" + oldData[1] + "-" + oldData[0];

                    res.render('emp-edit', {
                        host: host,
                        id: id,
                        token: token,
                        empreendimento: empreendimento,
                        localizacao: localizacao,
                        lancamento: newData,
                        cotas: cotas,
                        section: 'emp'
                    });
                });
            }
        });
    }

    PostAtualizaEmpreendimento(req, res) {
        const {id, token} = req.params;
        const acao = 'ATUALIZADO';
        const emp_descricao = req.body.emp_descricao.substring(0, 50);
        const emp_localizacao = req.body.emp_localizacao.substring(0, 100);
        const emp_dt_lcto = dateToEN(req.body.emp_dt_lcto);
        const emp_cotas = req.body.emp_cotas;
        const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`UPDATE empreendimentos SET Descricao='${emp_descricao}', Localizacao='${emp_localizacao}', DataLancamento='${emp_dt_lcto}', QuantidadeCotas='${emp_cotas}' WHERE ID=${id}`, (dataset) => {
                    //console.log(dataset);
                    SQL.Query('SELECT DATE_FORMAT(DataLancamento, "%d/%m/%Y") AS DataLancamento, Descricao, Localizacao, QuantidadeCotas FROM empreendimentos WHERE FlagStatus=1 ORDER BY Descricao', (dataset) => {
                        res.render('empreendimentos', {
                            host: host,
                            token: token,
                            empreendimentos: dataset,
                            nome: emp_descricao,
                            acao: acao,
                            section: 'emp'
                        });
                    });
                });
            }
        });
    }
}

function dateToEN(date){
    return date.split('/').reverse().join('-');
}

module.exports = EmpController;