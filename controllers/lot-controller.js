const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class LotController {
 
    GetListaLotes(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;
        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                     lt.Metragem, lt.Numero,
                     CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                     CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                     emp.Descricao as "Empreendimento",
                     CASE WHEN (SELECT MAX(Id)
                     FROM reservas res
                     WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                     THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                     FROM lotes lt, empreendimentos emp 
                     WHERE lt.IdEmpreendimento = emp.Id 
                     AND lt.FlagStatus = 1 
                     ORDER BY lt.descricao`

         jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {        
                
                SQL.Query(query, (dataset) => {
                    //console.log(dataset);
                    res.render('lotes', {
                        host: host,
                        token: token,
                        lotes: dataset,
                        nome: nome,
                        acao: acao,
                        section: 'lot'
                    });
                });
            }
        })
    }

    GetCadastraLote(req, res) {
        const {token} = req.params;
        const id = parseInt(req.params.id);
        const host = process.env.HOST;
        let cliente = '';
        let emp_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE FlagStatus=1', (dataset) => {
                    emp_dataset = dataset;
                    res.render('lot-include', {
                        host: host,
                        id: id,
                        token: token,
                        cliente: cliente,
                        empreendimentos: emp_dataset,
                        section: 'lot'
                    });

                });                
            };
        });
    };

    PostCadastraLote(req, res) {
        const {token} = req.params;
        let nome = '';
        const acao = 'CADASTRADO';
        const lot_desc = req.body.lot_desc
        const lot_emp = req.body.lot_emp
        const lot_matr = req.body.lot_matr
        const lot_quad = req.body.lot_quad;
        const lot_num = req.body.lot_num;
        const lot_metr = req.body.lot_metr;
        const lot_vlm2 = req.body.lot_vlm2.replace("R$","").split('.').join('').replace(',','.');
        const lot_vltot = req.body.lot_vltot.replace("R$","").split('.').join('').replace(',','.');
        const host = process.env.HOST;

        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                    lt.Metragem, lt.Numero,
                    CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                    CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                    emp.Descricao as "Empreendimento",
                    CASE WHEN (SELECT MAX(Id)
                    FROM reservas res
                    WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                    THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                    FROM lotes lt, empreendimentos emp 
                    WHERE lt.IdEmpreendimento = emp.Id 
                    AND lt.FlagStatus = 1 
                    ORDER BY lt.descricao`
        
        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`INSERT INTO lotes(descricao, numero, quadra, matricula, metragem, valorM2, valorTotal, idempreendimento, flagstatus) VALUES('${lot_desc}','${lot_num}','${lot_quad}','${lot_matr}','${lot_metr}','${lot_vlm2}','${lot_vltot}','${lot_emp}', 1)`, (dataset) => {
                    dataset = '';
                    SQL.Query(query, (dataset) => {
                        res.render('lotes', {
                            host: host,
                            token: token,
                            lotes: dataset,
                            nome: lot_desc,
                            acao: acao,
                            section: 'lot'
                        });
                    });
                });
            }
        })
    }

    GetDeletaLote(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let numero ='';
        let matricula = '';
        let quadra = '';
        let metragem = '';
        let valorM2 = '';
        let valorTotal = '';
        let empreendimento = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT lt.Id, lt.Descricao, lt.Numero, lt.Quadra, lt.Matricula, lt.Metragem, CONCAT('R$ ', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2", CONCAT('R$ ', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", emp.Descricao as "Empreendimento" FROM lotes lt, empreendimentos emp WHERE lt.IdEmpreendimento = emp.Id AND lt.id=${id}`, (dataset) => {
                    //console.log(dataset)
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            descricao = el.Descricao;
                            numero = el.Numero;
                            quadra = el.Quadra;
                            matricula = el.Matricula;
                            metragem = el.Metragem;
                            valorM2 = el.ValorM2;
                            valorTotal = el.ValorTotal;
                            empreendimento = el.Empreendimento
                        }
                    });
                    res.render('lot-delete', {
                        host: host,
                        id: id,
                        token: token,
                        descricao: descricao,
                        numero: numero,
                        quadra: quadra,
                        matricula: matricula,
                        metragem: metragem,
                        valorM2: valorM2,
                        valorTotal: valorTotal,
                        empreendimento: empreendimento,
                        section: 'lot'
                    });
                });
            }
        });
    }

    PostDeletaLote(req, res) {
        const {id, token} = req.params;
        const acao = 'EXCLUÍDO';
        const host = process.env.HOST;
        let nome = "";

        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                    lt.Metragem, lt.Numero,
                    CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                    CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                    emp.Descricao as "Empreendimento",
                    CASE WHEN (SELECT MAX(Id)
                    FROM reservas res
                    WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                    THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                    FROM lotes lt, empreendimentos emp 
                    WHERE lt.IdEmpreendimento = emp.Id 
                    AND lt.FlagStatus = 1 
                    ORDER BY lt.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT descricao FROM lotes WHERE id=${id}`, (dataset) => {
                    //  let nome = JSON.stringify(dataset);
                    //  console.log('O nome é: ' + nome);
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.descricao;
                        }
                        SQL.Query(`UPDATE lotes SET FlagStatus=0 WHERE ID=${id}`, (dataset) => {

                            SQL.Query(query, (dataset) => {
                                //let nreg = parseInt(dataset.length);
                                //const nome = dataset[nreg -1].Nome;
                                res.render('lotes', {
                                    host: host,
                                    token: token,
                                    lotes: dataset,
                                    nome: nome,
                                    acao: acao,
                                    section: 'lot'
                                });
                            });
                        });
                    });
                })
            }
        })
    }

    GetAtualizaLote(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let numero ='';
        let matricula = '';
        let quadra = '';
        let metragem = '';
        let valorM2 = '';
        let valorTotal = '';
        let empreendimento = '';
        let emp_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE FlagStatus=1', (dataset) => {
                    emp_dataset = dataset;
                     SQL.Query(`SELECT lt.Id, lt.Descricao, lt.Numero, lt.Quadra, lt.Matricula, lt.Metragem, CONCAT('R$ ', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2", CONCAT('R$ ', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", emp.Descricao as "Empreendimento" FROM lotes lt, empreendimentos emp WHERE lt.IdEmpreendimento = emp.Id AND lt.id=${id}`, (dataset) => {
                        dataset.forEach(function(el, i) {
                            if (el.Id = id) {
                                descricao = el.Descricao;
                                numero = el.Numero;
                                quadra = el.Quadra;
                                matricula = el.Matricula;
                                metragem = el.Metragem;
                                valorM2 = el.ValorM2;
                                valorTotal = el.ValorTotal;
                                empreendimento = el.Empreendimento
                            }
                        });

                        res.render('lot-edit', {
                            host: host,
                            id: id,
                            token: token,
                            descricao: descricao,
                            numero: numero,
                            quadra: quadra,
                            matricula: matricula,
                            metragem: metragem,
                            valorM2: valorM2,
                            valorTotal: valorTotal,
                            empreendimento: empreendimento,
                            empreendimentos: emp_dataset,
                            section: 'lot'
                        });
                    });
                })
            }
        });
    }

    PostAtualizaLote(req, res) {
        const {id, token} = req.params;
        const acao = 'ATUALIZADO';
        const lot_desc = req.body.lot_desc
        const lot_emp = req.body.lot_emp
        const lot_matr = req.body.lot_matr
        const lot_quad = req.body.lot_quad;
        const lot_num = req.body.lot_num;
        const lot_metr = req.body.lot_metr;
        const lot_vlm2 = req.body.lot_vlm2.replace("R$","").split('.').join('').replace(',','.');
        const lot_vltot = req.body.lot_vltot.replace("R$","").split('.').join('').replace(',','.');
        const host = process.env.HOST;


        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                    lt.Metragem, lt.Numero,
                    CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                    CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                    emp.Descricao as "Empreendimento",
                    CASE WHEN (SELECT MAX(Id)
                    FROM reservas res
                    WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                    THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                    FROM lotes lt, empreendimentos emp 
                    WHERE lt.IdEmpreendimento = emp.Id 
                    AND lt.FlagStatus = 1 
                    ORDER BY lt.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {

                SQL.Query(`UPDATE lotes SET descricao='${lot_desc}', numero='${lot_num}', matricula='${lot_matr}', quadra='${lot_quad}', metragem='${lot_metr}', valorM2='${lot_vlm2}', valorTotal='${lot_vltot}', idempreendimento='${lot_emp}' WHERE ID=${id}`, (dataset) => {
                    //console.log(dataset);
                    SQL.Query(query, (dataset) => {
                        res.render('lotes', {
                            host: host,
                            token: token,
                            lotes: dataset,
                            nome: lot_desc,
                            acao: acao,
                            section: 'lot'
                        });
                    });
                });
            }
        });
    }

    // RESERVA COMECA AQUI    
    GetReservaLote(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let idlote = '';
        let descricao = '';
        let numero ='';
        let matricula = '';
        let quadra = ''; 
        let metragem = '';
        let valorM2 = '';
        let valorTotal = '';
        let empreendimento = '';
        let status = '';
        let idempreendimento = '';
        let cli_dataset = '';
        let con_dataset = '';

        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                     lt.Metragem, lt.Numero,
                     CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                     CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                     emp.Id as "IdEmpreendimento", emp.Descricao as "Empreendimento",
                     CASE WHEN (SELECT MAX(Id)
                     FROM reservas res
                     WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                     THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                     FROM lotes lt, empreendimentos emp 
                     WHERE lt.IdEmpreendimento = emp.Id 
                     AND lt.id=${id}`        

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query('SELECT id, descricao FROM contas WHERE FlagStatus=1', (dataset) => {
                    con_dataset = dataset;
                    SQL.Query('SELECT id, nome FROM clientes WHERE id > 1 AND FlagStatus=1', (dataset) => {
                        cli_dataset = dataset;
                        SQL.Query(query, (dataset) => {
                            //console.log(dataset)
                            dataset.forEach(function(el, i) {
                                if (el.Id = id) {
                                    idlote = el.Id;
                                    descricao = el.Descricao;
                                    numero = el.Numero;
                                    quadra = el.Quadra;
                                    matricula = el.Matricula;
                                    metragem = el.Metragem;
                                    valorM2 = el.ValorM2;
                                    valorTotal = el.ValorTotal;
                                    empreendimento = el.Empreendimento;
                                    idempreendimento = el.IdEmpreendimento;
                                    status = el.status
                                }
                            });
                            res.render('lot-reserva', {
                                host: host,
                                id: id,
                                token: token,
                                idlote: idlote,
                                descricao: descricao,
                                numero: numero,
                                quadra: quadra,
                                matricula: matricula,
                                metragem: metragem,
                                valorM2: valorM2,
                                valorTotal: valorTotal,
                                empreendimento: empreendimento,
                                status: status,
                                idempreendimento: idempreendimento,
                                clientes: cli_dataset,
                                contas: con_dataset,
                                section: 'lot'
                            });
                        });
                    });
                });
            }
        });
    }

    PostReservaLote(req, res) {
        const {id, token} = req.params;        
        const acao = 'RESERVADO';
        const {lot_dsc, lot_cli, lot_obs} = req.body;
        const host = process.env.HOST;

        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                    lt.Metragem, lt.Numero,
                    CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                    CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                    emp.Descricao as "Empreendimento",
                    CASE WHEN (SELECT MAX(Id)
                    FROM reservas res
                    WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                    THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                    FROM lotes lt, empreendimentos emp 
                    WHERE lt.IdEmpreendimento = emp.Id 
                    AND lt.FlagStatus = 1 
                    ORDER BY lt.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else { 
                SQL.Query(`INSERT INTO reservas(idcliente, idlote, obs, flagstatus) VALUES('${lot_cli}','${id}','${lot_obs}', 1)`, (dataset) => {
  
                    SQL.Query(query, (dataset) => {
                        //let nreg = parseInt(dataset.length);
                        //const nome = dataset[nreg -1].Nome;
                        res.render('lotes', {
                            host: host,
                            token: token,
                            lotes: dataset,
                            nome: lot_dsc,
                            acao: acao,
                            section: 'lot'
                        });
                    }); 
                });           
            }
        })
    }
   

    // RESERVA TERMINA AQUI

    GetVendaLote(req, res) {
        const {id, token} = req.params;
        const host = process.env.HOST;
        let descricao = '';
        let numero ='';
        let matricula = '';
        let quadra = '';
        let metragem = '';
        let valorM2 = '';
        let valorTotal = '';
        let empreendimento = '';
        let idempreendimento = '';
        let idlote = '';
        let cli_dataset = '';
        let cat_dataset = '';
        let con_dataset = '';
        let cax_dataset = '';

        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                     lt.Metragem, lt.Numero,
                     CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                     CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                     emp.Id as "IdEmpreendimento", emp.Descricao as "Empreendimento",
                     CASE WHEN (SELECT MAX(Id)
                     FROM reservas res
                     WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                     THEN 'Reservado' ELSE 'Disponível' END AS "Status" 
                     FROM lotes lt, empreendimentos emp 
                     WHERE lt.IdEmpreendimento = emp.Id 
                     AND lt.id=${id}`        

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query('SELECT id, descricao FROM concategorias WHERE FlagStatus=1', (dataset) => {
                    cat_dataset = dataset;
                    SQL.Query('SELECT id, descricao FROM caixas WHERE FlagStatus=1', (dataset) => {
                        cax_dataset = dataset;
                        SQL.Query('SELECT id, descricao FROM contas WHERE FlagStatus=1', (dataset) => {
                            con_dataset = dataset;
                            SQL.Query('SELECT id, nome FROM clientes WHERE id > 1 AND FlagStatus=1', (dataset) => {
                                cli_dataset = dataset;
                                SQL.Query(query, (dataset) => {
                                    //console.log(dataset)
                                    dataset.forEach(function(el, i) {
                                        if (el.Id = id) {
                                            idlote = el.Id;
                                            descricao = el.Descricao;
                                            numero = el.Numero;
                                            quadra = el.Quadra;
                                            matricula = el.Matricula;
                                            metragem = el.Metragem;
                                            valorM2 = el.ValorM2;
                                            valorTotal = el.ValorTotal;
                                            empreendimento = el.Empreendimento;
                                            idempreendimento = el.IdEmpreendimento;                                    
                                        }
                                    });
                                    res.render('lot-venda', {
                                        host: host,
                                        id: id,
                                        token: token,
                                        descricao: descricao,
                                        numero: numero,
                                        quadra: quadra,
                                        matricula: matricula,
                                        metragem: metragem,
                                        valorM2: valorM2,
                                        valorTotal: valorTotal,
                                        empreendimento: empreendimento,
                                        idempreendimento: idempreendimento,
                                        idlote: idlote,
                                        clientes: cli_dataset,
                                        categorias: cat_dataset,
                                        contas: con_dataset,
                                        caixas: cax_dataset,
                                        section: 'lot'
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    }

    PostVendaLote(req, res) {
        const {id, token} = req.params;        
        const acao = 'VENDIDO';
        const {lot_cli, lot_dat, lot_cat, lot_con, lot_cax} = req.body  
        const lot_val = req.body.lot_val.replace("R$","").split('.').join('').replace(',','.');     
        const flx_tip = 'E';
        const host = process.env.HOST;

        let idcota = '';
        let nome = '';
        let lot_emp = '';        
        let lot_des = '';

        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                    lt.Metragem, lt.Numero,
                    CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                    CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                    emp.Descricao as "Empreendimento",
                    CASE WHEN (SELECT MAX(Id)
                    FROM reservas res
                    WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                    THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                    FROM lotes lt, empreendimentos emp 
                    WHERE lt.IdEmpreendimento = emp.Id 
                    AND lt.FlagStatus = 1 
                    ORDER BY lt.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {  
                SQL.Query(` SELECT emp.id as "idemp", emp.descricao as "empreendimento", lot.id as "idlot", lot.descricao as "lote" FROM empreendimentos emp, lotes lot WHERE lot.idempreendimento = emp.id AND lot.id = ${id}`, (dataset) => {
                    dataset.forEach(function(el, i) {
                        if (el.Id = id) {
                            nome = el.empreendimento;
                            lot_emp = el.idemp;
                            lot_des = el.lote;
                        }
                        SQL.Query(`SELECT COALESCE(MIN(id),0) as "idcota" FROM vendas WHERE idcliente = ${lot_cli} AND idemp = ${lot_emp} AND  flagstatus = 1`, (dataset) => {
                            dataset.forEach(function(el, i) {                                
                                idcota = el.idcota; 
                                SQL.Query(`UPDATE reservas SET FlagStatus=0 WHERE idlote=${id}`, (dataset) => {                               
                                    SQL.Query(`UPDATE cotas SET FlagStatus=0 WHERE id=${idcota}`, (dataset) => {
                                        SQL.Query(`UPDATE lotes SET FlagStatus=0 WHERE id=${id}`, (dataset) => {
                                            SQL.Query(`INSERT INTO vendas (idcliente, idemp, iditem, tipoitem, valor, flagstatus) VALUES('${lot_cli}', '${lot_emp}','${id}', 'L', '${lot_val}', 1)`, (dataset) => {
                                            if (lot_con) {
                                                SQL.Query(`INSERT INTO lancamentos (descricao, data, tipo, valor, idempreendimento, idconta, idcategoria, idcaixa, flagstatus) VALUES ('Venda de ${lot_des}', '${lot_dat}', '${flx_tip}', '${lot_val}', ${lot_emp}, ${lot_con}, ${lot_cat}, ${lot_cax}, 1)`, (dataset) => {
                                                });
                                                } 
                                                SQL.Query(query, (dataset) => {
                                                    //let nreg = parseInt(dataset.length);
                                                    //const nome = dataset[nreg -1].Nome;
                                                    res.render('lotes', {
                                                        host: host,
                                                        token: token,
                                                        lotes: dataset,
                                                        nome: nome,
                                                        acao: acao,
                                                        section: 'lot'
                                                    });
                                                });
                                            });                                
                                        });
                                    });
                                });
                            });
                        });
                    });
                })
            }
        })
    }

    GetListaTabela(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;
        let emp_dataset = '';

        let query = `SELECT lot.Id, lot.Descricao, lot.Quadra, lot.Numero, lot.Matricula, lot.Metragem, 
                    CONCAT('R$', FORMAT(lot.ValorM2,2,'de_DE')) as "ValorM2", 
                    CONCAT('R$', FORMAT(lot.ValorTotal,2,'de_DE')) as "ValorTotal",
                    emp.Descricao as "Empreendimento",
                    CASE WHEN (SELECT MAX(Id)
                    FROM reservas res
                    WHERE res.IdLote = lot.Id AND res.flagstatus=1) 
                    THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                    FROM lotes lot, empreendimentos emp 
                    WHERE lot.IdEmpreendimento = emp.Id 
                    AND lot.FlagStatus = 1
                    ORDER BY lot.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                    emp_dataset = dataset;
                    SQL.Query(query, (dataset) => {
                         res.render('lot-tabela-m2', {
                            host: host,
                            token: token,
                            lotes: dataset,
                            empreendimentos: emp_dataset,
                            nome: nome,
                            acao: acao,
                            section: 'tbl'
                        });
                    });
                });
            }
        })
    }

    PostListaTabela(req, res) {
        const {token} = req.params;
        const {lot_emp, hide_m2} = req.body; 
        const host = process.env.HOST;
        let nome = "";
        let acao = "";
        let filterEmp = "";
        let emp_dataset = "";

        if (lot_emp !== 'Todos') filterEmp = ' AND lot.idempreendimento=' + lot_emp + ' '
 
        let query = `SELECT lot.Id, lot.Descricao, lot.Quadra, lot.Numero, lot.Matricula, lot.Metragem, 
                     CONCAT('R$', FORMAT(lot.ValorM2,2,'de_DE')) as "ValorM2", 
                     CONCAT('R$', FORMAT(lot.ValorTotal,2,'de_DE')) as "ValorTotal",
                        emp.Descricao as "Empreendimento",
                     CASE WHEN (SELECT MAX(Id)
                     FROM reservas res
                     WHERE res.IdLote = lot.Id AND res.flagstatus=1) 
                     THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                       FROM lotes lot, empreendimentos emp 
                      WHERE lot.IdEmpreendimento = emp.Id 
                        AND lot.FlagStatus = 1
                        ${filterEmp}
                    ORDER BY lot.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                    emp_dataset = dataset;
                    SQL.Query(query, (dataset) => {
                        if (hide_m2) {                        
                            res.render('lot-tabela', {
                                host: host,
                                token: token,
                                lotes: dataset,
                                empreendimentos: emp_dataset,
                                nome: nome,
                                acao: acao,
                                section: 'tbl'
                            });
                        } else {
                            res.render('lot-tabela-m2', { 
                                host: host,
                                token: token,
                                lotes: dataset,
                                empreendimentos: emp_dataset,
                                nome: nome,
                                acao: acao,
                                section: 'tbl'
                            });
                        }
                    });
                });
            }
        })
    }

    GetReajuste(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let nome = null;
        let acao = null;
        let emp_dataset = '';

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                    emp_dataset = dataset;  
                        res.render('lot-reajuste', {
                        host: host,
                        token: token,
                        lotes: dataset,
                        empreendimentos: emp_dataset,
                        nome: nome,
                        acao: acao,
                        section: 'rjt'
                    });
                });
            }
        })
    }

    PostReajuste(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let {lot_emp, percent, reajuste} = req.body;
        let nome = "";
        let emp_dataset = '';
        let query = '';
        let querytwo = '';
        let filterEmp = '';

        if (lot_emp !== 'Todos') filterEmp = ' WHERE idempreendimento=' + lot_emp + ' ';

        let operator = (reajuste === 'Acréscimo') ? '+' : '-';
        let acao = (reajuste === 'Acréscimo') ? 'acréscimo de ' + percent :  'desconto de ' + percent;

            query = `UPDATE lotes
                        SET valorM2 = valorM2 ${operator} ((valorM2 / 100) * ${percent})
                        ${filterEmp}`
            querytwo = `UPDATE lotes
                        SET valorTotal = valorTotal ${operator} ((valorTotal / 100) * ${percent})
                        ${filterEmp}`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else {
                //console.log(query);

                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                    emp_dataset = dataset;
                    SQL.Query(query, (dataset) => {
                        SQL.Query(querytwo, (dataset) => {
                            res.render('lot-reajuste', {
                                host: host,
                                token: token,
                                lotes: dataset,
                                empreendimentos: emp_dataset,
                                nome: nome,
                                acao: acao,
                                section: 'rjt'
                            });
                        });
                    });
                });
            }
        })
    }

    GetBuscaReservas(req, res) {
        const {token, lote} = req.params;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {                
                SQL.Query(`SELECT res.id, cli.nome as "cliente" FROM clientes cli, reservas res, lotes lot WHERE res.idcliente = cli.id AND res.idlote = lot.id AND lot.id ='${lote}' AND res.flagstatus = 1`, (dataset) => {   
                    if (dataset.length > 0){
                        res.send(dataset); 
                    } else {
                         res.send([{ cliente: 'Não Encontrado' }]);                        
                    }
                });
            }
        });
    }

    GetCancelaReserva(req, res) {
        const {token, lote} = req.params;        
        const acao = 'RESERVA CANCELADA';
        const host = process.env.HOST;

        let query = `SELECT lt.Id, lt.Descricao, lt.Quadra, lt.Matricula, 
                    lt.Metragem, lt.Numero,
                    CONCAT('R$', FORMAT(lt.ValorTotal,2,'de_DE')) as "ValorTotal", 
                    CONCAT('R$', FORMAT(lt.ValorM2,2,'de_DE')) as "ValorM2",
                    emp.Descricao as "Empreendimento",
                    CASE WHEN (SELECT MAX(Id)
                    FROM reservas res
                    WHERE res.IdLote = lt.Id AND res.flagstatus=1) 
                    THEN 'Reservado' ELSE 'Disponível' END AS "Status"
                    FROM lotes lt, empreendimentos emp 
                    WHERE lt.IdEmpreendimento = emp.Id 
                    AND lt.FlagStatus = 1 
                    ORDER BY lt.descricao`

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                res.redirect('/')
            } else { 
                SQL.Query(`UPDATE reservas SET FlagStatus=0 WHERE idlote=${lote}`, (dataset) => {
  
                    SQL.Query(query, (dataset) => {
                        //let nreg = parseInt(dataset.length);
                        //const nome = dataset[nreg -1].Nome;
                        console.log('Sucesso!');
                        res.render('lotes', {
                            host: host,
                            token: token,
                            lotes: dataset,
                            nome: '',
                            acao: acao,
                            section: 'lot'
                        });
                    }); 
                });           
            }
        })
    }

    GetBuscaDados(req, res) {
        const {token, cli, emp} = req.params;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                SQL.Query(`SELECT COUNT(*) as "total" FROM vendas WHERE idcliente = ${cli} AND idemp = ${emp} AND tipoitem = 'C' AND FlagStatus=1`, (dataset) => {   
                    res.send(dataset);
                });
            }
        });
    }
}

module.exports = LotController;