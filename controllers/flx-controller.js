const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class FlxController {

    GetListaFluxo(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let tipo = '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let movimentos= '';
        let cat_dataset = '';
        let con_dataset = '';
        let emp_dataset = '';
        let cax_dataset = '';

          let query = `SELECT sld.id, sld.descricao,
          DATE_FORMAT (sld.data,'%d/%m/%Y') as "data", 
          sld.tipo,
          FORMAT(sld.valor,2,'de_DE') as "valor", 
                         sld.empreendimento, 
                         sld.categoria,
                         sld.conta,
                         sld.caixa,  
          CASE
             WHEN sld.tipo = 'S'
             THEN
               FORMAT(@running_total:=@running_total - sld.valor,2,'de_DE')
             ELSE
               FORMAT(@running_total:=@running_total + sld.valor,2,'de_DE') 
         END  
         AS saldo     
            FROM
                (SELECT lct.id, lct.descricao, 
                    lct.data as "data", 
                    lct.tipo as "tipo", 
                    lct.valor as "valor",   
                    emp.descricao as "empreendimento", 
                    cat.descricao as "categoria",
                    con.descricao as "conta",
                    cax.descricao as "caixa"
                    FROM empreendimentos emp, contas con, 
                    lancamentos lct, concategorias cat, caixas cax
                    WHERE lct.idconta = con.id 
                    AND lct.idempreendimento = emp.id 
                    AND lct.idcategoria = cat.id
                    AND lct.idcaixa = cax.id
                    AND lct.flagstatus = 1
                    GROUP BY lct.id
                    ORDER BY lct.data) sld
                JOIN (SELECT @running_total:=0) r
                ORDER BY sld.data
                `;

        let groupquery = `select
                                FORMAT(total_debito,2,'de_DE') as "total_debito", FORMAT(total_credito,2,'de_DE') as "total_credito",
                                FORMAT(abs(total_debito - total_credito),2,'de_DE') as "saldo",
                                (case when total_debito > total_credito then 'Negativo' else 'Positivo' end) tp
                            from (select
                                sum(case when tipo='S' then valor else 0 end) total_debito, 
                                sum(case when tipo='E' then valor else 0 end) total_credito
                            from (select lct.id, lct.descricao, 
                                DATE_FORMAT (lct.data,'%d/%m/%Y') as "data", 
                                lct.tipo, 
                                lct.valor, 
                                emp.descricao as "empreendimento", 
                                con.descricao as "conta",
                                cax.descricao as "caixa"
                                from empreendimentos emp, contas con, 
                                lancamentos lct, concategorias cat,
                                caixas cax
                                where lct.idconta = con.id 
                                and lct.idempreendimento = emp.id 
                                and lct.idcategoria = cat.id
                                and lct.idcaixa = cax.id
                                and lct.idcategoria > 1
                                and lct.flagstatus = 1) tab
                                ) resultado`;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                //console.log(query);
                SQL.Query('SELECT id, descricao FROM concategorias WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                cat_dataset = dataset; 
                    SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                    emp_dataset = dataset;  
                        SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                        con_dataset = dataset;
                            SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1 ORDER BY descricao', (dataset) => {
                                cax_dataset = dataset;
                                SQL.Query(query, (dataset) => { 
                                    movimentos = dataset;
                                    //console.log(dataset);
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

                                        res.render('fluxo', {
                                            host: host,
                                            token: token,
                                            movimentos: movimentos,
                                            tipo: tipo,
                                            totaldeb: totaldeb,
                                            totalcrd: totalcrd,
                                            saldo: saldo,
                                            flx_emp: 'Todos',
                                            flx_cat: 'Todas',
                                            flx_con: 'Todas',
                                            flx_cax: 'Todos',
                                            dt_ini: '',
                                            dt_fim: str_data,
                                            caixas: cax_dataset,
                                            categorias: cat_dataset,
                                            contas: con_dataset,
                                            empreendimentos: emp_dataset,
                                            section: 'flx'
                                        });
                                    });
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
        const {flx_emp, flx_cat, flx_con, flx_cax, dt_ini, dt_fim} = req.body;
        const host = process.env.HOST;
        let filterEmp = '';
        let filterCat = '';
        let filterDat = '';
        let filterCon = '';
        let filterCax = '';
        let empreendimento ='';
        let categoria ='';
        let conta ='';
        let caixa ='';
        let tipo = '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let movimentos= '';
        let cat_dataset = '';
        let con_dataset = '';
        let cax_dataset = '';
        let emp_dataset = '';

        if (flx_emp !== 'Todos') filterEmp = ' AND emp.id=' + flx_emp + ' '
        if (flx_cat !== 'Todas') filterCat = ' AND cat.id=' + flx_cat + ' '
        if (flx_con !== 'Todas') filterCon = ' AND con.id=' + flx_con + ' '
        if (flx_cax !== 'Todos') filterCax = ' AND cax.id=' + flx_cax + ' '
        if (dt_ini) filterDat = ' AND data BETWEEN ' + `'` + dt_ini + `'` + ' AND ' + `'` + dt_fim + `'`

        let fluxoQuery = `SELECT sld.id, sld.descricao,
        DATE_FORMAT (sld.data,'%d/%m/%Y') as "data", 
        sld.tipo,
        FORMAT(sld.valor,2,'de_DE') as "valor", 
                       sld.empreendimento, 
                       sld.categoria,
                       sld.conta,
                       sld.caixa,  
        CASE
           WHEN sld.tipo = 'S'
           THEN
             FORMAT(@running_total:=@running_total - sld.valor,2,'de_DE')
           ELSE
             FORMAT(@running_total:=@running_total + sld.valor,2,'de_DE')
       END  
       AS saldo     
          FROM
              (SELECT lct.id, lct.descricao, 
                  lct.data as "data", 
                  lct.tipo as "tipo", 
                  lct.valor as "valor",   
                  emp.descricao as "empreendimento", 
                  cat.descricao as "categoria",
                  con.descricao as "conta",
                  cax.descricao as "caixa"
                  FROM empreendimentos emp, contas con, 
                  lancamentos lct, concategorias cat, caixas cax
                  WHERE lct.idconta = con.id 
                  AND lct.idempreendimento = emp.id 
                  AND lct.idcategoria = cat.id
                  AND lct.idcaixa = cax.id
                  ${filterEmp}
                  ${filterCat}
                  ${filterCon}
                  ${filterCax}
                  ${filterDat}
                  AND lct.flagstatus = 1
                  GROUP BY lct.id
                  ORDER BY lct.data) sld
              JOIN (SELECT @running_total:=0) r
              ORDER BY sld.data`;

        let sumQuery = `select
                                FORMAT(total_debito,2,'de_DE') as "total_debito", FORMAT(total_credito,2,'de_DE') as "total_credito",
                                FORMAT(abs(total_debito - total_credito),2,'de_DE') as "saldo",
                                (case when total_debito > total_credito then 'Negativo' else 'Positivo' end) tp
                            from (select
                                sum(case when tipo='S' then valor else 0 end) total_debito, 
                                sum(case when tipo='E' then valor else 0 end) total_credito
                            from (select lct.id, lct.descricao, 
                                DATE_FORMAT (lct.data,'%d/%m/%Y') as "data", 
                                lct.tipo, 
                                lct.valor, 
                                emp.descricao as "empreendimento", 
                                cat.descricao as "categoria",
                                con.descricao as "conta",
                                cax.descricao as "caixa"
                                from empreendimentos emp, contas con, 
                                lancamentos lct, concategorias cat, caixas cax
                                where lct.idconta = con.id 
                                and lct.idempreendimento = emp.id 
                                and lct.idcategoria = cat.id
                                and lct.idcaixa = cax.id
                                ${filterEmp}
                                ${filterCat}
                                ${filterCon}
                                ${filterCax}
                                ${filterDat}
                                and lct.flagstatus = 1) tab
                                ) resultado`;
                                //and lct.idcategoria > 1

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                //console.log(query);
                SQL.Query('SELECT id, descricao FROM concategorias WHERE flagstatus = 1', (dataset) => {
                cat_dataset = dataset; 
                    SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                    emp_dataset = dataset;  
                        SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1', (dataset) => {
                        con_dataset = dataset; 
                            SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1', (dataset) => {
                                cax_dataset = dataset;                       
                                SQL.Query(fluxoQuery, (dataset) => {
                                    dataset.forEach(function(el, i) {
                                        filterEmp ? empreendimento = el.empreendimento : empreendimento = 'Todos'; 
                                        filterCat ? categoria = el.categoria : categoria = 'Todas';
                                        filterCon ? conta = el.conta : conta = 'Todas';  
                                        filterCax ? caixa = el.caixa : caixa = 'Todos';                              
                                    });                    
                                    movimentos = dataset;
                                    //console.log(dataset);
                                    SQL.Query(sumQuery, (dataset) => {
                                        dataset.forEach(function(el, i) {
                                            totaldeb = el.total_debito;
                                            totalcrd = el.total_credito;
                                            saldo = el.saldo;
                                            tipo = el.tp;
                                        });                                    
                                        res.render('fluxo', {
                                            host: host,
                                            token: token,
                                            movimentos: movimentos,
                                            tipo: tipo,
                                            totaldeb: totaldeb,
                                            totalcrd: totalcrd,
                                            saldo: saldo,
                                            flx_emp: empreendimento,
                                            flx_cat: categoria,
                                            flx_con: conta,
                                            flx_cax: caixa,
                                            dt_ini: dt_ini.split('-').reverse().join('/'),
                                            dt_fim: dt_fim.split('-').reverse().join('/'),
                                            categorias: cat_dataset,
                                            contas: con_dataset,
                                            caixas: cax_dataset,
                                            empreendimentos: emp_dataset,
                                            section: 'flx'
                                        });                                  
                                    });
                                });
                            });                        
                        });
                    });
                });
            }
        })
    }
}

module.exports = FlxController;