const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class ConCatController {

    GetListaCategorias(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;
        let query = 'SELECT id, grupo, descricao FROM concategorias WHERE flagstatus = 1 ORDER BY grupo, descricao'

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(query, (dataset) => {
                    //console.log(dataset);
                    res.render('concategorias', {
                        host: host,
                        token: token,
                        concategorias: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'ctg'
                    });
                });
            }
        })
    }

    GetCadastraCategoria(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;

      jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
            //res.send(err.message)
            res.redirect('/')
        } else {    
            res.render('concat-include', {
            host: host,
            id: id,
            token: token,
            cliente: '',
            section: 'ctg'
          });         
        };
      });
    };

    PostCadastraCategoria(req, res) {
      const {token} = req.params;
      const acao = 'CADASTRADA';
      const cat_des = req.body.cat_des; 
      const cat_grp = req.body.cat_grp; 
      const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
          if (err) {
              //res.send(err.message)
              res.redirect('/')
          } else {
              SQL.Query(`INSERT INTO concategorias(descricao, grupo, flagstatus) VALUES('${cat_des}','${cat_grp}', 1)`, (dataset) => {
                  SQL.Query('SELECT id, descricao, grupo FROM concategorias WHERE flagstatus = 1 ORDER BY grupo, descricao', (dataset) => {
                      res.render('concategorias', {
                          host: host,
                          token: token,
                          concategorias: dataset,
                          nome: cat_des,
                          acao: acao,
                          section: 'ctg'
                      });
                  });
              });
            }
        })
    }

    GetDeletaCategoria(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let grupo = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT id, descricao, grupo FROM concategorias WHERE Id=${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            descricao = el.descricao;
                            grupo = el.grupo;
                        }
                    });
                    res.render('concat-delete', {
                        host:host,
                        id: id,
                        token: token,
                        descricao: descricao,
                        grupo: grupo,
                        section: 'ctg'
                    });
                });

            }
        });
    }

    PostDeletaCategoria(req, res) {
      const {id, token} = req.params;
      const acao = 'EXCLUÍDA'; 
      const host = process.env.HOST;
      let nome = '';

      jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else { 
                SQL.Query(`SELECT descricao FROM concategorias WHERE id=${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.descricao;
                        }         
                    SQL.Query(`UPDATE concategorias SET flagstatus=0 WHERE id=${id}`, (dataset) => {
                        SQL.Query('SELECT id, descricao, grupo FROM concategorias WHERE flagstatus = 1 ORDER BY grupo, descricao', (dataset) => {
                            res.render('concategorias', {
                                host: host,
                                id: id,
                                token: token,
                                concategorias: dataset,
                                nome: nome,
                                acao: acao,
                                section: 'ctg'
                            });
                        });
                    });
                });
            });
         }
      })
    }

    GetAtualizaCategoria(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let grupo = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT id, descricao, grupo FROM concategorias WHERE Id=${id}`, (dataset) => {
                dataset.forEach(function(el, i) {
                    if (el.Id = id) {
                        descricao = el.descricao;
                        grupo = el.grupo;
                    }
                });
                res.render('concat-edit', {
                    host: host,
                    id: id,
                    token: token,
                    descricao: descricao,
                    grupo: grupo,
                    section: 'ctg'
                });
            });
        }
    });
}

    PostAtualizaCategoria(req, res) {
        const {id, token} = req.params;
        const acao = 'ATUALIZADA'; 
        const cat_des = req.body.cat_des; 
        const cat_grp = req.body.cat_grp;
        const host = process.env.HOST;

      jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {                      
                SQL.Query(`UPDATE concategorias SET descricao='${cat_des}', grupo='${cat_grp}' WHERE id=${id}`, (dataset) => {
                    SQL.Query('SELECT id, descricao, grupo FROM concategorias WHERE flagstatus = 1 ORDER BY grupo, descricao', (dataset) => {
                        res.render('concategorias', {
                            host: host,
                            id: id,
                            token: token,
                            concategorias: dataset,
                            nome: cat_des,
                            acao: acao,
                            section: 'ctg'
                        });
                    });
                }); 
            }
        }) 
    } 
}

module.exports = ConCatController;