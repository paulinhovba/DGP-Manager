const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class VenController {

    GetListaFluxo(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;

          let query = `SELECT lct.id, lct.descricao, 
                      DATE_FORMAT (lct.data,'%d/%m/%Y') as "data", 
                      lct.tipo, 
                      CONCAT('R$ ', FORMAT(lct.valor,2,'de_DE')) as "valor", 
                      emp.descricao as "empreendimento", 
                      con.descricao as "conta"
                      FROM empreendimentos emp, contas con, lancamentos lct 
                      WHERE lct.idconta = con.id 
                      AND lct.idempreendimento = emp.id 
                      AND lct.flagstatus = 1
                      ORDER BY DATE_FORMAT (lct.data,'%d/%m/%Y') as "data" ASC`;

        let groupquery = `select
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
                                from empreendimentos emp, contas con, lancamentos lct 
                                where lct.idconta = con.id 
                                and lct.idempreendimento = emp.id 
                                and lct.flagstatus = 1) tab
                                ) resultado`;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                //console.log(query);
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                emp_dataset = dataset;  
                    SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1', (dataset) => {
                    con_dataset = dataset;
                        SQL.Query(query, (dataset) => {                    
                            movimentos = dataset;
                            SQL.Query(groupquery, (dataset) => {
                                dataset.forEach(function(el, i) {
                                    totaldeb = el.total_debito;
                                    totalcrd = el.total_credito;
                                    saldo = el.saldo;
                                    tipo = el.tp;
                                });

                                // Obtém a data/hora atual
                                var data = new Date();
                                // Guarda cada pedaço em uma variável
                                var dia     = data.getDate();           // 1-31
                                //var dia_sem = data.getDay();            // 0-6 (zero=domingo)
                                var mes     = data.getMonth();          // 0-11 (zero=janeiro)
                                //var ano2    = data.getYear();           // 2 dígitos
                                var ano4    = data.getFullYear();       // 4 dígitos
                                //var hora    = data.getHours();          // 0-23
                                //var min     = data.getMinutes();        // 0-59
                                //var seg     = data.getSeconds();        // 0-59
                                // Formata a data e a hora (note o mês + 1)
                                var str_data = dia + '/' + (mes+1) + '/' + ano4;
                                //var str_hora = hora + ':' + min + ':' + seg;
                                //var str_data1 = ano4 + '-' + dia  + '-' +  (mes+1);
                                //console.log(str_data1);

                                res.render('layout', {
                                    host: host,
                                    token: token,
                                    movimentos: movimentos,
                                    tipo: tipo,
                                    totaldeb: totaldeb,
                                    totalcrd: totalcrd,
                                    saldo: saldo,
                                    flx_emp: 'Todos',
                                    flx_con: 'Todas',
                                    dt_ini: '',
                                    dt_fim: str_data,
                                    contas: con_dataset,
                                    empreendimentos: emp_dataset,
                                    section: 'flx'
                                });
                            });
                        });
                    });
                });
            }
        })
    }

    PostListaFluxo(req, res) {
        const {token} = req.params;
        const {flx_emp, flx_con, dt_ini, dt_fim} = req.body;
        const host = process.env.HOST;
        let filterEmp = '';
        let filterCon = '';
        let filterDat = '';
        let empreendimento ='';
        let conta ='';
        let tipo = '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let movimentos= '';
        let con_dataset = '';
        let emp_dataset = '';

        if (flx_emp !== 'Todos') filterEmp = ' AND emp.id=' + flx_emp + ' '
        if (flx_con !== 'Todas') filterCon = ' AND con.id=' + flx_con + ' '
        if (dt_ini) filterDat = ' AND data BETWEEN ' + `'` + dt_ini + `'` + ' AND ' + `'` + dt_fim + `'`

        let query = `SELECT lct.id, lct.descricao, 
                      DATE_FORMAT (lct.data,'%d/%m/%Y') as "data", 
                      lct.tipo, 
                      CONCAT('R$ ', FORMAT(lct.valor,2,'de_DE')) as "valor", 
                      emp.descricao as "empreendimento", 
                      con.descricao as "conta"
                      FROM empreendimentos emp, contas con, lancamentos lct 
                      WHERE lct.idconta = con.id 
                      AND lct.idempreendimento = emp.id 
                      ${filterEmp}
                      ${filterCon}
                      ${filterDat}
                      AND lct.flagstatus = 1
                      ORDER BY DATE_FORMAT (lct.data,'%d/%m/%Y') as "data" ASC`;

        let Groupquery = `select
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
                                from empreendimentos emp, contas con, lancamentos lct 
                                where lct.idconta = con.id 
                                and lct.idempreendimento = emp.id 
                                ${filterEmp}
                                ${filterCon}
                                ${filterDat}
                                and lct.flagstatus = 1) tab
                                ) resultado`;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                //console.log(query);
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                emp_dataset = dataset;  
                    SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                    con_dataset = dataset;
                        SQL.Query(query, (dataset) => {
                            dataset.forEach(function(el, i) {
                                filterEmp ? empreendimento = el.empreendimento : empreendimento = 'Todos';  
                                filterCon ? conta = el.conta : conta = 'Todas';                                
                            });                    
                            movimentos = dataset;
                            SQL.Query(Groupquery, (dataset) => {
                                dataset.forEach(function(el, i) {
                                    totaldeb = el.total_debito;
                                    totalcrd = el.total_credito;
                                    saldo = el.saldo;
                                    tipo = el.tp;
                                });

                                res.render('layout', {
                                    host: host,
                                    token: token,
                                    movimentos: movimentos,
                                    tipo: tipo,
                                    totaldeb: totaldeb,
                                    totalcrd: totalcrd,
                                    saldo: saldo,
                                    flx_emp: empreendimento,
                                    flx_con: conta,
                                    dt_ini: dt_ini.split('-').reverse().join('/'),
                                    dt_fim: dt_fim.split('-').reverse().join('/'),
                                    contas: con_dataset,
                                    empreendimentos: emp_dataset,
                                    section: 'flx'
                                });
                            });
                        });
                    });
                });
            }
        })
    }
}

module.exports = VenController;