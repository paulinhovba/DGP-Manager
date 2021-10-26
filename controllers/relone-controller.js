const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();

class RelOneController {

    GetListaRel(req, res) {
        const {token} = req.params;
        const host = process.env.HOST;
        let movimentos= '';
        let disponibilidades= '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let tipo = '';
        let nomedis= '';
        let total= '';
        let emp_dataset = '';

        let querysomadisp = `SELECT 'Disponibilidades'
                                AS "nome",
                                FORMAT(
                                SUM(
                                    CASE
                                        WHEN lct.tipo = 'S'
                                        THEN
                                            concat('-', lct.valor)
                                        ELSE
                                            lct.valor
                                    END),
                                2,
                                'de_DE')
                                AS "total"
                        FROM empreendimentos emp,
                        contas con,
                        lancamentos lct,
                        concategorias cat,
                        caixas cax
                        WHERE     lct.idconta = con.id
                            AND lct.idempreendimento = emp.id
                            AND lct.idcategoria = cat.id
                            AND lct.idcaixa = cax.id
                            AND lct.flagstatus = 1
                        GROUP BY nome`

        let querysoma = `select
                            CONCAT('-', FORMAT(total_debito,2,'de_DE')) as "total_debito", FORMAT(total_credito,2,'de_DE') as "total_credito",
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
                            con.descricao as "conta"
                            from empreendimentos emp, contas con, 
                            lancamentos lct, concategorias cat, caixas cax
                            where lct.idconta = con.id 
                            and lct.idempreendimento = emp.id 
                            and lct.idcategoria = cat.id
                            and lct.idcaixa = cax.id
                            and cat.grupo IN ('Receitas','Despesas')
                            and lct.flagstatus = 1) tab
                            ) resultado`

        let querydisp = `SELECT 'Disponibilidade'
                            AS "nome",
                        cax.descricao
                            AS "caixa",
                        FORMAT(
                            SUM(
                                CASE
                                    WHEN lct.tipo = 'S'
                                    THEN
                                        concat('-', lct.valor)
                                    ELSE
                                        lct.valor
                                END),
                            2,
                            'de_DE')
                            AS "total"
                    FROM empreendimentos emp,
                    contas con,
                    lancamentos lct,
                    concategorias cat,
                    caixas cax
                    WHERE     lct.idconta = con.id
                        AND lct.idempreendimento = emp.id
                        AND lct.idcategoria = cat.id
                        AND lct.idcaixa = cax.id
                        AND lct.flagstatus = 1
                    GROUP BY caixa`

        let query = `SELECT COALESCE(IF(categoria IS NOT NULL AND conta IS NULL,
                                    CONCAT('Subtotal - ', categoria),
                                    categoria), 'TOTAL RECEITAS E DESPESAS')
                                    AS "categoria",
                                conta,
                                total
                        FROM (SELECT IF(con.descricao IS NULL,
                                        CONCAT('Subtotal - ', cat.descricao),
                                        cat.descricao)
                                        AS "categoria",
                                    con.descricao
                                        AS "conta",
                                    FORMAT(
                                            SUM(
                                                CASE
                                                WHEN lct.tipo = 'S'
                                                THEN
                                                    concat('-', lct.valor)
                                                ELSE
                                                    lct.valor
                                                END),
                                            2,
                                            'de_DE')
                                        AS "total"
                                FROM contas con, lancamentos lct, concategorias cat
                                WHERE   lct.idconta = con.id
                                    AND lct.idcategoria = cat.id
                                    AND lct.flagstatus = 1
                                    AND cat.grupo IN ('Receitas','Despesas')
                                GROUP BY categoria DESC, conta WITH ROLLUP) resultado`;

        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                //console.log(query);
                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                emp_dataset = dataset; 
                    SQL.Query(querydisp, (dataset) => { 
                    disponibilidades = dataset;
                        SQL.Query(query, (dataset) => { 
                        movimentos = dataset;
                            SQL.Query(querysomadisp, (dataset) => { 
                                dataset.forEach(function(el, i) {
                                    nomedis = el.nome;
                                    total = el.total;
                                });
                                SQL.Query(querysoma, (dataset) => {
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
                                    var mes     = data.getMonth();          // 0-11 (zero=janeiro)
                                    var ano4    = data.getFullYear();       // 4 dígitos

                                    // Formata a data e a hora (note o mês + 1)
                                    var str_data = dia + '/' + (mes+1) + '/' + ano4;
                                    
                                    res.render('rel-one', {
                                        host: host,
                                        token: token,  
                                        movimentos: movimentos,
                                        disponibilidades: disponibilidades,
                                        totaldeb: totaldeb,
                                        totalcrd: totalcrd,
                                        saldo: saldo,
                                        tipo: tipo,
                                        nomedis: nomedis,
                                        total: total,
                                        empreendimentos: emp_dataset,
                                        flx_emp: 'Todos',
                                        flx_cat: 'Todas',
                                        flx_con: 'Todas',
                                        dt_ini: '',
                                        dt_fim: str_data,
                                        section: 'rel-one'
                                    });
                                });                                    
                            });
                        });
                    });
                });
            }
        })
    }

    PostListaRel(req, res) {
        const {token} = req.params;
        const {flx_emp, dt_ini, dt_fim} = req.body;
        const host = process.env.HOST;
        let filterEmp = '';
        let filterDat = '';
        let empreendimento ='';
        let movimentos= '';
        let disponibilidades= '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let tipo = '';
        let nomedis= '';
        let total= '';
        let cat_dataset = '';
        let con_dataset = '';
        let emp_dataset = '';

        if (flx_emp !== 'Todos') filterEmp = ' AND lct.idempreendimento=' + flx_emp + ' '
        if (dt_ini) filterDat = ' AND data BETWEEN ' + `'` + dt_ini + `'` + ' AND ' + `'` + dt_fim + `'`

        let querysomadisp = `SELECT 'Disponibilidades'
                                AS "nome",
                                FORMAT(
                                SUM(
                                    CASE
                                        WHEN lct.tipo = 'S'
                                        THEN
                                            concat('-', lct.valor)
                                        ELSE
                                            lct.valor
                                    END),
                                2,
                                'de_DE')
                                AS "total"
                        FROM empreendimentos emp,
                        contas con,
                        lancamentos lct,
                        concategorias cat,
                        caixas cax
                        WHERE     lct.idconta = con.id
                            AND lct.idempreendimento = emp.id
                            AND lct.idcategoria = cat.id
                            AND lct.idcaixa = cax.id
                            AND lct.flagstatus = 1
                        GROUP BY nome`

        let querysoma = `select
                            CONCAT('-', FORMAT(total_debito,2,'de_DE')) as "total_debito", FORMAT(total_credito,2,'de_DE') as "total_credito",
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
                            con.descricao as "conta"
                            from empreendimentos emp, contas con, 
                            lancamentos lct, concategorias cat, caixas cax
                            where lct.idconta = con.id 
                            and lct.idempreendimento = emp.id 
                            and lct.idcategoria = cat.id
                            and lct.idcaixa = cax.id
                            and cat.grupo IN ('Receitas','Despesas')
                            ${filterEmp}
                            ${filterDat}
                            and lct.flagstatus = 1) tab
                            ) resultado`

        let querydisp = `SELECT 'Disponibilidade'
                            AS "nome",
                        cax.descricao
                            AS "caixa",
                        FORMAT(
                            SUM(
                                CASE
                                    WHEN lct.tipo = 'S'
                                    THEN
                                        concat('-', lct.valor)
                                    ELSE
                                        lct.valor
                                END),
                            2,
                            'de_DE')
                            AS "total"
                    FROM empreendimentos emp,
                    contas con,
                    lancamentos lct,
                    concategorias cat,
                    caixas cax
                    WHERE     lct.idconta = con.id
                        AND lct.idempreendimento = emp.id
                        AND lct.idcategoria = cat.id
                        AND lct.idcaixa = cax.id
                        AND lct.flagstatus = 1
                    GROUP BY caixa`

        let query = `SELECT COALESCE(IF(categoria IS NOT NULL AND conta IS NULL,
                                    CONCAT('Subtotal - ', categoria),
                                    categoria), 'TOTAL RECEITAS E DESPESAS')
                                    AS "categoria",
                                conta,
                                total
                        FROM (SELECT IF(con.descricao IS NULL,
                                        CONCAT('Subtotal - ', cat.descricao),
                                        cat.descricao)
                                        AS "categoria",
                                    con.descricao
                                        AS "conta",
                                    FORMAT(
                                            SUM(
                                                CASE
                                                WHEN lct.tipo = 'S'
                                                THEN
                                                    concat('-', lct.valor)
                                                ELSE
                                                    lct.valor
                                                END),
                                            2,
                                            'de_DE')
                                        AS "total"
                                FROM contas con, lancamentos lct, concategorias cat
                                WHERE   lct.idconta = con.id
                                    AND lct.idcategoria = cat.id
                                    AND lct.flagstatus = 1
                                    AND cat.grupo IN ('Receitas','Despesas')
                                    ${filterEmp}
                                    ${filterDat}
                                GROUP BY categoria DESC, conta WITH ROLLUP) resultado`;

         jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {
                //console.log(query);

                if (flx_emp !== 'Todos') {
                    SQL.Query(`SELECT descricao FROM empreendimentos WHERE id=${flx_emp}`, (dataset) => {
                        dataset.forEach(function(el, i) {
                            empreendimento = el.descricao;
                        });
                    });
                } else {
                    empreendimento = 'Todos'
                }

                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                emp_dataset = dataset; 

                    SQL.Query(querydisp, (dataset) => { 
                    disponibilidades = dataset;
                    
                        SQL.Query(querysomadisp, (dataset) => { 
                            dataset.forEach(function(el, i) {
                                nomedis = el.nome;
                                total = el.total;
                            });

                            SQL.Query(querysoma, (dataset) => {
                                dataset.forEach(function(el, i) {
                                    totaldeb = el.total_debito;
                                    totalcrd = el.total_credito;
                                    saldo = el.saldo;
                                    tipo = el.tp;
                                });

                                SQL.Query(query, (dataset) => {                                                        
                                    movimentos = dataset;  

                                    res.render('rel-one', {
                                        host: host,
                                        token: token,  
                                        movimentos: movimentos,
                                        disponibilidades: disponibilidades,
                                        totaldeb: totaldeb,
                                        totalcrd: totalcrd,
                                        saldo: saldo,
                                        tipo: tipo,
                                        nomedis: nomedis,
                                        total: total,
                                        empreendimentos: emp_dataset,
                                        flx_emp: empreendimento,
                                        dt_ini: dt_ini.split('-').reverse().join('/'),
                                        dt_fim: dt_fim.split('-').reverse().join('/'),
                                        section: 'rel-one'
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

module.exports = RelOneController;