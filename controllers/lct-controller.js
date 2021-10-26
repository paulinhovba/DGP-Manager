const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class LctController {

    GetListaLancamentos(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;
        let query = `SELECT lct.id,
                          lct.descricao,
                          DATE_FORMAT(lct.data, '%d/%m/%Y') AS "data",
                          lct.tipo,
                          CONCAT('R$ ', FORMAT(lct.valor, 2, 'de_DE')) AS "valor",
                          emp.descricao AS "empreendimento",
                          cat.descricao AS "categoria",
                          con.descricao AS "conta",
                          cax.descricao AS "caixa"
                      FROM empreendimentos emp, contas con, lancamentos lct, concategorias cat, caixas cax
                      WHERE lct.idconta = con.id
                      AND lct.idempreendimento = emp.id
                      AND lct.idcategoria = cat.id
                      AND lct.idcaixa = cax.id
                      AND lct.flagstatus = 1
                      ORDER BY lct.data DESC`
        
        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(query, (dataset) => {
                    res.render('lancamentos', {
                        host: host,
                        token: token,
                        lancamentos: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'lct'
                    });
                });
            }
        })
    }

    GetCadastraLancamento(req, res) {
      const {id, token} = req.params;
      const host = process.env.HOST;
      let con_dataset = '';
      let emp_dataset = '';
      let cat_dataset = '';
      let cax_dataset = '';
  
      jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
            //res.send(err.message)
            res.redirect('/')
        } else {
          SQL.Query('SELECT id, descricao FROM concategorias WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
          cat_dataset = dataset;   
            SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
            emp_dataset = dataset;  
              SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
              con_dataset = dataset;  
              SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                cax_dataset = dataset; 
                  res.render('lct-include', {
                  host: host,
                  id: id,
                  token: token,
                  cliente: '',
                  categorias: cat_dataset,
                  contas: con_dataset,
                  caixas: cax_dataset,
                  empreendimentos: emp_dataset,
                  section: 'lct'
                  }); 
                }); 
              }); 
            });  
          });      
        };
      });
    };

    PostCadastraLancamento(req, res) {
      const {token} = req.params;
      const acao = 'CADASTRADO';
      const { lct_des, lct_dat, lct_emp, lct_cat, lct_con, lct_cax } = req.body
      const lct_val = req.body.lct_val.replace("R$","").split('.').join('').replace(',','.');
      const lct_tip = req.body.lct_tip.toUpperCase();
      const host = process.env.HOST;

        jwt.verify(token, process.env.SECRET, (err) => {
          if (err) {
              //res.send(err.message)
              res.redirect('/')
          } else { 
              SQL.Query(`INSERT INTO lancamentos(descricao, data, valor, tipo, IdEmpreendimento, IdCategoria, IdConta, IdCaixa, flagstatus) VALUES('${lct_des}','${lct_dat}','${lct_val}','${lct_tip}','${lct_emp}','${lct_cat}','${lct_con}','${lct_cax}',1)`, (dataset) => {
                  SQL.Query(`SELECT lct.id,
                                    lct.descricao,
                                    DATE_FORMAT(lct.data, '%d/%m/%Y') AS "data",
                                    lct.tipo,
                                    CONCAT('R$ ', FORMAT(lct.valor, 2, 'de_DE')) AS "valor",
                                    emp.descricao AS "empreendimento",
                                    cat.descricao AS "categoria",
                                    con.descricao AS "conta",
                                    cax.descricao AS "caixa"
                                FROM empreendimentos emp, contas con, lancamentos lct, concategorias cat, caixas cax
                                WHERE lct.idconta = con.id
                                AND lct.idempreendimento = emp.id
                                AND lct.idcategoria = cat.id
                                AND lct.idcaixa = cax.id
                                AND lct.flagstatus = 1
                                ORDER BY lct.data DESC`, (dataset) => {
                      res.render('lancamentos', {
                          host: host,
                          token: token,
                          lancamentos: dataset,
                          nome: lct_des,
                          acao: acao,
                          section: 'lct'
                      });
                  });
              });
            }
        })
    }

    GetDeletaLancamento(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let data = '';
        let tipo = '';
        let valor = '';
        let empreendimento = '';
        let categoria = '';
        let conta = '';
        let caixa = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {                
                      
                SQL.Query(`SELECT lct.id,
                                  lct.descricao,
                                  DATE_FORMAT(lct.data, '%d/%m/%Y') AS "data",
                                  lct.tipo,
                                  CONCAT('R$ ', FORMAT(lct.valor, 2, 'de_DE')) AS "valor",
                                  emp.descricao AS "empreendimento",
                                  cat.descricao AS "categoria",
                                  con.descricao AS "conta",
                                  cax.descricao AS "caixa"
                              FROM empreendimentos emp, contas con, lancamentos lct, concategorias cat, caixas cax
                              WHERE lct.idconta = con.id
                              AND lct.idempreendimento = emp.id
                              AND lct.idcategoria = cat.id
                              AND lct.idcaixa = cax.id
                              AND lct.id=${id}`, (dataset) => {
                  dataset.forEach(function(el, i) {
                    if (el.Id = id) {
                      descricao = el.descricao;
                      data = el.data;
                      tipo = el.tipo;
                      valor = el.valor;
                      empreendimento = el.empreendimento;
                      categoria = el.categoria;
                      conta = el.conta;
                      caixa = el.caixa;
                    }
                  });
                  res.render('lct-delete', {
                    host: host,
                    id: id,
                    token: token,
                    descricao: descricao,
                    data: data,
                    tipo: tipo,
                    valor: valor,
                    empreendimento: empreendimento,
                    categoria: categoria,
                    conta: conta,
                    caixa: caixa,
                    section: 'lct'
                  });
                });
            }
        });
    }

    PostDeletaLancamento(req, res) {
      const {id, token} = req.params;
      const acao = 'EXCLUÍDO';
      const host = process.env.HOST; 
      let nome = '';

      jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else { 
                SQL.Query(`SELECT descricao FROM lancamentos WHERE id=${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.descricao;
                        }         
                    SQL.Query(`UPDATE lancamentos SET flagstatus=0 WHERE id=${id}`, (dataset) => {
                        SQL.Query(`SELECT lct.id,
                                        lct.descricao,
                                        DATE_FORMAT(lct.data, '%d/%m/%Y') AS "data",
                                        lct.tipo,
                                        CONCAT('R$ ', FORMAT(lct.valor, 2, 'de_DE')) AS "valor",
                                        emp.descricao AS "empreendimento",
                                        cat.descricao AS "categoria",
                                        con.descricao AS "conta",
                                        cax.descricao AS "caixa"
                                    FROM empreendimentos emp, contas con, lancamentos lct, concategorias cat, caixas cax
                                    WHERE lct.idconta = con.id
                                    AND lct.idempreendimento = emp.id
                                    AND lct.idcategoria = cat.id
                                    AND lct.idcaixa = cax.id
                                    AND lct.flagstatus = 1
                                    ORDER BY lct.data DESC`, (dataset) => {
                            res.render('lancamentos', {
                                host: host,
                                token: token,
                                lancamentos: dataset,
                                nome: nome,
                                acao: acao,
                                section: 'lct'
                            });
                        });
                    });
                });
            });
         }
      })
    }

    GetAtualizaLancamento(req, res) {
      const {id, token} = req.params;
      const host = process.env.HOST;
      let descricao = '';
      let data = '';
      let tipo = '';
      let valor = '';
      let empreendimento = '';
      let categoria = '';
      let conta = '';
      let caixa = '';
      let cat_dataset = '';
      let con_dataset = '';
      let cax_dataset = '';
      let emp_dataset = '';

      jwt.verify(token, process.env.SECRET, (err) => {
          if (err) {
              //res.send(err.message)
              res.redirect('/')
          } else {
            SQL.Query('SELECT id, descricao FROM concategorias WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
            cat_dataset = dataset; 
              SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                emp_dataset = dataset;  
                  SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                    con_dataset = dataset; 
                    SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                      cax_dataset = dataset;
                        SQL.Query(`SELECT lct.id,
                                        lct.descricao,
                                        DATE_FORMAT(lct.data, '%d/%m/%Y') AS "data",
                                        lct.tipo,
                                        CONCAT('R$ ', FORMAT(lct.valor, 2, 'de_DE')) AS "valor",
                                        emp.descricao AS "empreendimento",
                                        cat.descricao AS "categoria",
                                        con.descricao AS "conta",
                                        cax.descricao AS "caixa"
                                    FROM empreendimentos emp, contas con, lancamentos lct, concategorias cat, caixas cax
                                    WHERE lct.idconta = con.id
                                    AND lct.idempreendimento = emp.id
                                    AND lct.idcategoria = cat.id
                                    AND lct.idcaixa = cax.id
                                      AND lct.id=${id}`, (dataset) => {
                          dataset.forEach(function(el, i) {
                            if (el.Id = id) {
                              descricao = el.descricao;
                              data = el.data;
                              tipo = el.tipo;
                              valor = el.valor
                              empreendimento = el.empreendimento;
                              categoria = el.categoria; 
                              caixa = el.caixa
                              conta = el.conta;                                                  
                            }
                            });
                          
                          //Formatar a DATA do BD para o controle HTML Input Date.
                          let oldData = data.split("/");                        
                          let newData = oldData[2] + "-" + oldData[1] + "-" + oldData[0];
        
                          res.render('lct-edit', {
                            host: host,
                            id: id,
                            token: token,
                            descricao: descricao,
                            data: newData,
                            tipo: tipo,
                            valor: valor,
                            empreendimento: empreendimento,
                            categoria: categoria,
                            conta: conta,
                            caixa: caixa,
                            empreendimentos: emp_dataset,
                            categorias: cat_dataset,                            
                            contas: con_dataset,
                            caixas: cax_dataset,
                            section: 'lct'
                          });
                      });
                    });
                  });
               });
            });
          }
      });
    }

    PostAtualizaLancamento(req, res) {
      const {id, token} = req.params;
      const acao = 'ATUALIZADO'; 
      let nome = '';
      const { lct_des, lct_dat, lct_emp, lct_cat, lct_con, lct_cax } = req.body;
      const lct_val = req.body.lct_val.replace("R$","").split('.').join('').replace(',','.');
      const lct_tip = req.body.lct_tip.toUpperCase();
      const host = process.env.HOST;

    jwt.verify(token, process.env.SECRET, (err) => {
          if (err) {
              //res.send(err.message)
              res.redirect('/')
          } else {
            
            SQL.Query(`UPDATE lancamentos SET descricao='${lct_des}', data='${lct_dat}', valor='${lct_val}', tipo='${lct_tip}', idempreendimento='${lct_emp}', idcategoria='${lct_cat}', idconta='${lct_con}', idcaixa='${lct_cax}'  WHERE id=${id}`, (dataset) => {
                SQL.Query(`SELECT lct.id,
                                lct.descricao,
                                DATE_FORMAT(lct.data, '%d/%m/%Y') AS "data",
                                lct.tipo,
                                CONCAT('R$ ', FORMAT(lct.valor, 2, 'de_DE')) AS "valor",
                                emp.descricao AS "empreendimento",
                                cat.descricao AS "categoria",
                                con.descricao AS "conta",
                                cax.descricao AS "caixa"
                            FROM empreendimentos emp, contas con, lancamentos lct, concategorias cat, caixas cax
                            WHERE lct.idconta = con.id
                            AND lct.idempreendimento = emp.id
                            AND lct.idcategoria = cat.id
                            AND lct.idcaixa = cax.id
                            AND lct.flagstatus = 1
                            ORDER BY lct.data DESC`, (dataset) => {
                    res.render('lancamentos', {
                        host: host,
                        token: token,
                        lancamentos: dataset,
                        nome: lct_des,
                        acao: acao,
                        section: 'lct'
                    });
                });
            });
          }
      }) 
    } 
}

module.exports = LctController;