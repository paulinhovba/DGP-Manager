const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class ConController {

    GetListaContas(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;
        let query = 'SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao'

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(query, (dataset) => {
                    //console.log(dataset);
                    res.render('contas', {
                        host: host,
                        token: token,
                        contas: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'con'
                    });
                });
            }
        })
    }

    GetCadastraConta(req, res) {
    const {id, token} = req.params;
    const host = process.env.HOST;
    let emp_dataset = '';

      jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
            //res.send(err.message)
            res.redirect('/')
        } else {   
          SQL.Query('SELECT id, descricao FROM empreendimentos WHERE FlagStatus = 1', (dataset) => {
            emp_dataset = dataset;   
               res.render('con-include', {
                host: host,
                id: id,
                token: token,
                cliente: '',
                empreendimentos: emp_dataset,
                section: 'con'
              }); 
          });         
        };
      });
    };

    PostCadastraConta(req, res) {
      const {token} = req.params;
      const acao = 'CADASTRADO';
      const con_des = req.body.con_des; 
      const con_emp = req.body.con_emp; 
      const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
          if (err) {
              //res.send(err.message)
              res.redirect('/')
          } else {
              SQL.Query(`INSERT INTO contas(descricao, flagstatus) VALUES('${con_des}', 1)`, (dataset) => {
                  SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                      res.render('contas', {
                          host: host,
                          token: token,
                          contas: dataset,
                          nome: con_des,
                          acao: acao,
                          section: 'con'
                      });
                  });
              });
            }
        })
    }

    GetDeletaConta(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let empreendimento = '';
        let emp_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT id, descricao FROM contas WHERE Id=${id}`, (dataset) => {
                    
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            descricao = el.descricao;
                        }
                    });
                    res.render('con-delete', {
                        host: host,
                        id: id,
                        token: token,
                        descricao: descricao,
                        section: 'con'
                    });
                });

            }
        });
    }

    PostDeletaConta(req, res) {
      const {id, token} = req.params;
      const acao = 'EXCLUÍDO'; 
      const host = process.env.HOST;
      let nome = '';

      jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else { 
                SQL.Query(`SELECT descricao FROM contas WHERE id=${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.descricao;
                        }         
                    SQL.Query(`UPDATE contas SET flagstatus=0 WHERE id=${id}`, (dataset) => {
                        SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                            res.render('contas', {
                                host: host,
                                id: id,
                                token: token,
                                contas: dataset,
                                nome: nome,
                                acao: acao,
                                section: 'con'
                            });
                        });
                    });
                });
            });
         }
      })
    }

 
    GetAtualizaConta(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let empreendimento = '';
        let emp_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT id, descricao FROM contas WHERE Id=${id}`, (dataset) => {
                dataset.forEach(function(el, i) {
                    if (el.Id = id) {
                        descricao = el.descricao;
                    }
                });
                res.render('con-edit', {
                    host: host,
                    id: id,
                    token: token,
                    descricao: descricao,
                    section: 'con'
                });
            });
        }
    });
}

    PostAtualizaConta(req, res) {
        const {id, token} = req.params;
        const acao = 'ATUALIZADO'; 
        const con_des = req.body.con_des;
        const host = process.env.HOST; 

      jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {                      
                SQL.Query(`UPDATE contas SET descricao='${con_des}' WHERE id=${id}`, (dataset) => {
                    SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                        res.render('contas', {
                            host: host,
                            id: id,
                            token: token,
                            contas: dataset,
                            nome: con_des,
                            acao: acao,
                            section: 'con'
                        });
                    });
                }); 
            }
        }) 
    } 
}

module.exports = ConController;