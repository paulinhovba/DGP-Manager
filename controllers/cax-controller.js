const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class CaxController {

    GetListaCaixas(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;        
        let query = 'SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao'

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(query, (dataset) => {
                    //console.log(dataset);
                    res.render('caixas', {
                        host: host,
                        token: token,
                        caixas: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'cax'
                    });
                });
            }
        })
    }

    GetCadastraCaixa(req, res) {
    const {id, token} = req.params;
    const host = process.env.HOST;
    let emp_dataset = '';

      jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
            //res.send(err.message)
            res.redirect('/')
        } else {   
            res.render('cax-include', {
            host: host,
            id: id,
            token: token,
            cliente: '',
            section: 'cax'
          });       
        };
      });
    };

    PostCadastraCaixa(req, res) {
      const {token} = req.params;
      const acao = 'CADASTRADO';
      const cax_des = req.body.cax_des; 
      const cax_emp = req.body.cax_emp;
      const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
          if (err) {
              //res.send(err.message)
              res.redirect('/')
          } else {
              SQL.Query(`INSERT INTO caixas(descricao, flagstatus) VALUES('${cax_des}', 1)`, (dataset) => {
                  SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                      res.render('caixas', {
                          host: host,
                          token: token,
                          caixas: dataset,
                          nome: cax_des,
                          acao: acao,
                          section: 'cax'
                      });
                  });
              });
            }
        })
    }

    GetDeletaCaixa(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT id, descricao FROM caixas WHERE Id=${id}`, (dataset) => {
                    
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                          descricao = el.descricao;
                        }
                    });
                    res.render('cax-delete', {
                        host: host,
                        id: id,
                        token: token,
                        descricao: descricao,
                        section: 'cax'
                    });
                });

            }
        });
    }

    PostDeletaCaixa(req, res) {
      const {id, token} = req.params;
      const acao = 'EXCLUÍDO';
      const host = process.env.HOST; 
      let nome = '';

      jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else { 
                SQL.Query(`SELECT descricao FROM caixas WHERE id=${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.descricao;
                        }         
                    SQL.Query(`UPDATE caixas SET flagstatus=0 WHERE id=${id}`, (dataset) => {
                        SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                            res.render('caixas', {
                                host: host,
                                id: id,
                                token: token,
                                caixas: dataset,
                                nome: nome,
                                acao: acao,
                                section: 'cax'
                            });
                        });
                    });
                });
            });
         }
      })
    }
 
    GetAtualizaCaixa(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT id, descricao FROM caixas WHERE Id=${id}`, (dataset) => {
                dataset.forEach(function(el, i) {
                    if (el.Id = id) {
                        descricao = el.descricao;
                    }
                });
                res.render('cax-edit', {
                    host: host,
                    id: id,
                    token: token,
                    descricao: descricao,
                    section: 'cax'
                });
            });
        }
    });
}

    PostAtualizaCaixa(req, res) {
        const {id, token} = req.params;
        const acao = 'ATUALIZADO'; 
        const cax_des = req.body.cax_des; 
        const host = process.env.HOST;

      jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {                      
                SQL.Query(`UPDATE caixas SET descricao='${cax_des}' WHERE id=${id}`, (dataset) => {
                    SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                        res.render('caixas', {
                            host: host,
                            id: id,
                            token: token,
                            caixas: dataset,
                            nome: cax_des,
                            acao: acao,
                            section: 'cax'
                        });
                    });
                }); 
            }
        }) 
    } 


    //COMEÇA AQUI

    GetTransfer(req, res) {
        const {
            token
        } = req.params;
        const host = process.env.HOST;
        let dados;
        let cax_dataset = '';
        let emp_dataset = '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let destino = null;
        let valor = null;
        let tipo = '';
        let acao = '';

        let groupQuery = `SELECT cax.descricao
                                    AS "caixa",
                                CONCAT(
                                    'R$ ',
                                    FORMAT(
                                    SUM(
                                        CASE
                                            WHEN lct.tipo = 'S' THEN concat('-', lct.valor)
                                            ELSE lct.valor
                                        END),
                                    2,
                                    'de_DE'))
                                    AS "total"
                            FROM empreendimentos emp,
                            contas con,
                            lancamentos lct,
                            concategorias cat,
                            caixas cax
                            WHERE   lct.idconta = con.id
                                AND lct.idempreendimento = emp.id
                                AND lct.idcategoria = cat.id
                                AND lct.idcaixa = cax.id
                                AND lct.flagstatus = 1
                            GROUP BY caixa
                            ORDER BY data ASC`

        let sumquery = `select
                              CONCAT('R$ ', FORMAT(total_debito,2,'de_DE')) as "total_debito", CONCAT('R$ ', FORMAT(total_credito,2,'de_DE')) as "total_credito",
                              CONCAT('R$ ', FORMAT(abs(total_debito - total_credito),2,'de_DE')) as "saldo",
                              (case when total_debito > total_credito then 'Negativo' else 'Positivo' end) tp
                          from (select
                              sum(case when tipo='S' then valor else 0 end) total_debito, 
                              sum(case when tipo='E' then valor else 0 end) total_credito
                          from (select lct.id, lct.descricao, 
                              DATE_FORMAT (lct.data,'%d/%m/%Y') as "data", 
                              lct.tipo, 
                              lct.valor, 
                              emp.descricao as "empreendimento", 
                              con.descricao as "conta"
                              from empreendimentos emp, contas con, 
                              lancamentos lct, concategorias cat
                              where lct.idconta = con.id 
                              and lct.idempreendimento = emp.id 
                              and lct.idcategoria = cat.id
                              and lct.idcategoria > 1
                              and lct.flagstatus = 1) tab
                              ) resultado`;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(sumquery, (dataset) => {
                    dataset.forEach(function(el, i) {
                        totaldeb = el.total_debito;
                        totalcrd = el.total_credito;
                        saldo = el.saldo;
                        tipo = el.tp;
                    });
                    SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                            emp_dataset = dataset;
                        SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                            cax_dataset = dataset;
                                SQL.Query(groupQuery, (dataset) => {
                                    dados = dataset;

                                    res.render('cax-transfer', {
                                        host: host,
                                        token: token,
                                        dados: dados,
                                        caixas: cax_dataset,
                                        empreendimentos: emp_dataset,
                                        flx_cax: 'Selecione...',
                                        totaldeb: totaldeb,
                                        totalcrd: totalcrd,
                                        saldo: saldo,
                                        destino: destino,
                                        valor: valor,
                                        tipo: tipo,
                                        acao: acao,
                                        section: 'rel-two',
                                    });

                                });
                        });
                    });
                });
            }
        });
    }


    PostTransfer(req, res) {
        const { token } = req.params;
        const { cax_des, cax_org, dt_trf, trf_emp } = req.body;  
        const cax_val = req.body.cax_val.replace("R$","").split('.').join('').replace(',','.');
        const host = process.env.HOST;
        let dados;
        let emp_dataset = '';
        let cax_dataset = '';
        let totaldeb = ''; 
        let totalcrd = '';
        let saldo = '';
        let tipo = '';
        let acao = '';
        let destino = '';
        let valor = '';        

        let groupQuery = `SELECT cax.descricao
                                    AS "caixa",
                                CONCAT(
                                    'R$ ',
                                    FORMAT(
                                    SUM(
                                        CASE
                                            WHEN lct.tipo = 'S' THEN concat('-', lct.valor)
                                            ELSE lct.valor
                                        END),
                                    2,
                                    'de_DE'))
                                    AS "total"
                            FROM empreendimentos emp,
                            contas con,
                            lancamentos lct,
                            concategorias cat,
                            caixas cax
                            WHERE   lct.idconta = con.id
                                AND lct.idempreendimento = emp.id
                                AND lct.idcategoria = cat.id
                                AND lct.idcaixa = cax.id
                                AND lct.flagstatus = 1
                            GROUP BY caixa
                            ORDER BY data ASC`

        let sumquery = `select
                              CONCAT('R$ ', FORMAT(total_debito,2,'de_DE')) as "total_debito", CONCAT('R$ ', FORMAT(total_credito,2,'de_DE')) as "total_credito",
                              CONCAT('R$ ', FORMAT(abs(total_debito - total_credito),2,'de_DE')) as "saldo",
                              (case when total_debito > total_credito then 'Negativo' else 'Positivo' end) tp
                          from (select
                              sum(case when tipo='S' then valor else 0 end) total_debito, 
                              sum(case when tipo='E' then valor else 0 end) total_credito
                          from (select lct.id, lct.descricao, 
                              DATE_FORMAT (lct.data,'%d/%m/%Y') as "data", 
                              lct.tipo, 
                              lct.valor, 
                              emp.descricao as "empreendimento", 
                              con.descricao as "conta"
                              from empreendimentos emp, contas con, 
                              lancamentos lct, concategorias cat
                              where lct.idconta = con.id 
                              and lct.idempreendimento = emp.id 
                              and lct.idcategoria = cat.id
                              and lct.idcategoria > 1
                              and lct.flagstatus = 1) tab
                              ) resultado`;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(sumquery, (dataset) => {
                    dataset.forEach(function(el, i) {
                        totaldeb = el.total_debito;
                        totalcrd = el.total_credito;
                        saldo = el.saldo;
                        tipo = el.tp;
                    });
                    SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                        emp_dataset = dataset;
                        SQL.Query(`SELECT id, descricao FROM caixas WHERE id = ${cax_des}`, (dataset) => {
                            dataset.forEach(function(el, i) {
                                destino = el.descricao;
                            });                       
                            SQL.Query(`INSERT INTO lancamentos (descricao, data, tipo, valor, idempreendimento, idcaixa, idcategoria, idconta, flagstatus) VALUES ('Transferência de Saldos', '${dt_trf}', 'S', '${cax_val}', ${trf_emp}, ${cax_org}, 1, 1, 1)`, (dataset) => {
                                SQL.Query(`INSERT INTO lancamentos (descricao, data, tipo, valor, idempreendimento, idcaixa, idcategoria, idconta, flagstatus) VALUES ('Transferência de Saldos', '${dt_trf}', 'E', '${cax_val}', ${trf_emp}, ${cax_des}, 1, 1, 1)`, (dataset) => {
                                    SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                                        cax_dataset = dataset;
                                            SQL.Query(groupQuery, (dataset) => {
                                                dados = dataset;                               

                                                res.render('cax-transfer', {
                                                    host: host,
                                                    token: token,
                                                    dados: dados,
                                                    empreendimentos: emp_dataset,
                                                    caixas: cax_dataset,
                                                    flx_con: 'Selecione...',
                                                    totaldeb: totaldeb,
                                                    totalcrd: totalcrd,
                                                    saldo: saldo,
                                                    destino: destino,
                                                    valor: cax_val,
                                                    tipo: tipo,
                                                    acao: acao,
                                                    section: 'rel-two',
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
    //TERMINA AQUI
}

module.exports = CaxController;