const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class CotController {

    GetListaCotas(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;
        let query = `SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.FlagStatus = 1 ORDER BY cot.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(query, (dataset) => {
                    //console.log(dataset);
                    res.render('cotas', {
                        host: host,
                        token: token,
                        cotas: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'cot'
                    });
                });
            }
        })
    }

    GetCadastraCota(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let emp_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE FlagStatus=1 ORDER BY descricao', (dataset) => {
                    emp_dataset = dataset;
                    dataset = '';                        
                        res.render('cot-include', {
                            host: host,
                            id: id,
                            token: token,
                            empreendimentos: emp_dataset,
                            section: 'cot'
                        });
                    });                              
            };
        });
    };


    PostCadastraCota(req, res) {
        const {token} = req.params;
        const acao = 'CADASTRADO';
        const cot_des = req.body.cot_des;
        const cot_val = req.body.cot_val.replace("R$","").split('.').join('').replace(',','.');
        const cot_emp = req.body.cot_emp;
        const host = process.env.HOST;
 
        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`INSERT INTO cotas(descricao, valor, idempreendimento, flagstatus) VALUES('${cot_des}','${cot_val}','${cot_emp}', 1)`, (dataset) => {
                    dataset = '';
                    SQL.Query(`SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.FlagStatus = 1 ORDER BY cot.descricao`, (dataset) => {
                        res.render('cotas', {
                            host: host,
                            token: token,
                            cotas: dataset,
                            nome: cot_des,
                            acao: acao,
                            section: 'cot'
                        });
                    });
                });
            }
        })
    }
 
    GetDeletaCota(req, res) {
        const { id, token } = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let valor = '';
        let empreendimento = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.id=${id}`, (dataset) => {
                    //console.log(dataset);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            descricao = el.Descricao;
                            valor = el.Valor;                    
                            empreendimento = el.Empreendimento
                        }
                    });
                    res.render('cot-delete', {
                        host: host,
                        id: id,
                        token: token,
                        descricao: descricao,                    
                        valor: valor,
                        empreendimento: empreendimento,
                        section: 'cot'
                    });
                });
            }
        });
    }

    PostDeletaCota(req, res) {
        const {id, token} = req.params;
        const acao = 'EXCLUÍDO';
        const host = process.env.HOST;
        let nome = "";

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT descricao FROM cotas WHERE id=${id}`, (dataset) => {
                    //  let nome = JSON.stringify(dataset);
                    //  console.log('O nome é: ' + nome);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.descricao;
                        }
                        SQL.Query(`UPDATE cotas SET FlagStatus=0 WHERE id=${id}`, (dataset) => {
                            SQL.Query(`SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.FlagStatus = 1 ORDER BY cot.descricao`, (dataset) => {
                                //let nreg = parseInt(dataset.length);
                                //const nome = dataset[nreg -1].Nome;
                                res.render('cotas', {
                                    host: host,
                                    id: id,
                                    token: token,
                                    cotas: dataset,
                                    nome: nome,
                                    acao: acao,
                                    section: 'cot'
                                });
                            });
                        });
                    });
                })
            }
        })
    }

    GetAtualizaCota(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let valor = '';
        let empreendimento = '';
        let emp_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                SQL.Query(`SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.id=${id}`, (dataset) => {
                    //console.log(dataset);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            descricao = el.Descricao;
                            valor = el.Valor;
                            empreendimento = el.Empreendimento
                        } 
                        //console.log(descricao+valor+cliente+empreendimento);                   
                        SQL.Query('SELECT id, descricao FROM empreendimentos WHERE FlagStatus=1', (dataset) => {
                            emp_dataset = dataset;
                                res.render('cot-edit', {
                                    host: host,
                                    id: id,
                                    token: token,                            
                                    descricao: descricao,
                                    valor: valor,
                                    empreendimento: empreendimento,
                                    empreendimentos: emp_dataset,
                                    section: 'cot'
                                });
                            });
                        });
                    });
               
            }
        });
    }

    PostAtualizaCota(req, res) {
        const {id, token} = req.params;
        const acao = 'ATUALIZADO';
        const {cot_des, cot_emp} = req.body
        const cot_val = req.body.cot_val.replace("R$","").split('.').join('').replace(',','.');
        const host = process.env.HOST;
        
        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`UPDATE cotas SET descricao='${cot_des}', valor='${cot_val}', idempreendimento='${cot_emp}' WHERE id=${id}`, (dataset) => {
                    SQL.Query(`SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.FlagStatus = 1 ORDER BY cot.descricao`, (dataset) => {
                        res.render('cotas', {
                            host: host,
                            id: id,
                            token: token,
                            cotas: dataset,
                            nome: cot_des,
                            acao: acao,
                            section: 'cot'
                        });
                    });
                });                           
            }      
        }); 
    } 

    GetVendaCota(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let valor = '';
        let empreendimento = '';
        let emp_dataset = '';
        let cli_dataset = '';
        let con_dataset = '';
        let cax_dataset = '';
        let cat_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                SQL.Query(`SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.id=${id}`, (dataset) => {
                    //console.log(dataset);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            descricao = el.Descricao;
                            valor = el.Valor;
                            empreendimento = el.Empreendimento
                        } 
                        SQL.Query('SELECT id, descricao FROM concategorias WHERE FlagStatus=1', (dataset) => {
                            cat_dataset = dataset;
                            SQL.Query('SELECT id, descricao FROM caixas WHERE FlagStatus=1', (dataset) => {
                                cax_dataset = dataset;
                                SQL.Query('SELECT id, descricao FROM contas WHERE FlagStatus=1', (dataset) => {
                                    con_dataset = dataset;                  
                                    SQL.Query('SELECT id, descricao FROM empreendimentos WHERE FlagStatus=1', (dataset) => {
                                        emp_dataset = dataset;
                                        SQL.Query('SELECT id, nome FROM clientes WHERE FlagStatus=1', (dataset) => {
                                            cli_dataset = dataset;                                         
                                            res.render('cot-venda', {
                                                host: host,
                                                id: id,
                                                token: token,                            
                                                descricao: descricao,
                                                valor: valor,
                                                empreendimento: empreendimento,
                                                empreendimentos: emp_dataset,
                                                clientes: cli_dataset,
                                                contas: con_dataset,
                                                categorias: cat_dataset,
                                                caixas: cax_dataset,
                                                section: 'cot'
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

    PostVendaCota(req, res) {
        const {id, token} = req.params;
        const acao = 'VENDIDA';
        const { cot_dat, cot_cli, cot_con, cot_cax, cot_cat } = req.body     
        const cot_val = req.body.cot_val.replace("R$","").split('.').join('').replace(',','.');
        const flx_tip = 'E';
        const host = process.env.HOST;
        let id_emp = "";
        let cot_des = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {   
                SQL.Query(`SELECT emp.id as "id", emp.descricao as "empreendimento", cot.descricao as "cota" FROM empreendimentos emp, cotas cot WHERE cot.idempreendimento = emp.id AND cot.id =${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            id_emp = el.id;
                            cot_des = el.cota;
                        }   
                        SQL.Query(`UPDATE cotas SET FlagStatus=0 WHERE id=${id}`, (dataset) => {
                            SQL.Query(`INSERT INTO vendas (idcliente, idemp, iditem, tipoitem, valor, flagstatus) VALUES('${cot_cli}', '${id_emp}','${id}', 'C', '${cot_val}', 1)`, (dataset) => {
                                SQL.Query(`INSERT INTO lancamentos (descricao, data, tipo, valor, idempreendimento, idcategoria, idconta, idcaixa, flagstatus) VALUES('Venda de ${cot_des}', '${cot_dat}', '${flx_tip}', '${cot_val}', ${id_emp}, ${cot_cat}, ${cot_con}, ${cot_cax}, 1)`, (dataset) => {
                                    SQL.Query(`SELECT cot.Id, cot.Descricao, CONCAT('R$ ', FORMAT(cot.Valor,2,'de_DE')) as "Valor", emp.Descricao as "Empreendimento" FROM cotas cot, empreendimentos emp WHERE cot.IdEmpreendimento = emp.Id AND cot.FlagStatus = 1 ORDER BY cot.descricao`, (dataset) => {
                                        res.render('cotas', {
                                            host: host,
                                            id: id,
                                            token: token,
                                            cotas: dataset,
                                            nome: cot_des,
                                            acao: acao,
                                            section: 'cot'
                                        });
                                    }); 
                                });   
                            });                            
                        });
                    })
                })
            }
        })
    }
}

module.exports = CotController;