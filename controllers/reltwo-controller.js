const jwt = require('jsonwebtoken');
const execSQLQuery = require("../database/database");
const SQL = new execSQLQuery();
require("dotenv-safe").config();


class RelTwoController {

    GetListaRel(req, res) {
        const {
            token
        } = req.params;
        const host = process.env.HOST;
        let dados;
        let cat_dataset = '';
        let con_dataset = '';
        let cax_dataset = '';
        let emp_dataset = '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let tipo = '';
        let acao = '';

        let groupQuery = `SELECT cat.grupo as "grupo",
                          cat.descricao
                                  AS "categoria",
                              CONCAT(
                                  'R$ ',
                                  FORMAT(
                                    SUM(
                                        CASE
                                        WHEN lct.tipo = 'S' 
                                        THEN concat('-', lct.valor)
                                          ELSE lct.valor
                                        END),
                                    2,
                                    'de_DE'))
                                  AS "total"
                        FROM empreendimentos emp,
                            contas con,
                            lancamentos lct,
                            concategorias cat
                        WHERE     lct.idconta = con.id
                              AND lct.idempreendimento = emp.id
                              AND lct.idcategoria = cat.id
                              AND lct.flagstatus = 1
                        GROUP BY categoria`

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
                    SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1', (dataset) => {
                        cax_dataset = dataset;
                        SQL.Query('SELECT id, descricao FROM concategorias WHERE flagstatus = 1', (dataset) => {
                            cat_dataset = dataset;
                            SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                                emp_dataset = dataset;
                                SQL.Query(groupQuery, (dataset) => {
                                    dados = dataset;

                                    // Obtém a data/hora atual
                                    var data = new Date();
                                    // Guarda cada pedaço em uma variável
                                    var dia = data.getDate(); // 1-31
                                    var mes = data.getMonth(); // 0-11 (zero=janeiro)
                                    var ano4 = data.getFullYear(); // 4 dígitos
                                    // Formata a data e a hora (note o mês + 1)
                                    var str_data = dia + '/' + (mes + 1) + '/' + ano4;

                                    res.render('rel-tree', {
                                        host: host,
                                        token: token,
                                        dados: dados,
                                        categorias: cat_dataset,
                                        contas: con_dataset,
                                        caixas: cax_dataset,
                                        empreendimentos: emp_dataset,
                                        flx_emp: 'Todos',
                                        flx_grp: 'Todas',
                                        flx_cat: 'Todas',
                                        dt_ini: '',
                                        dt_fim: str_data,
                                        totaldeb: totaldeb,
                                        totalcrd: totalcrd,
                                        saldo: saldo,
                                        tipo: tipo,
                                        dt_ini: '',
                                        dt_fim: str_data,
                                        acao: acao,
                                        section: 'rel-two',
                                    });

                                });
                            });
                        });
                    });
                });
            }
        });
    }


    PostListaRel(req, res) {
        const {
            token
        } = req.params;
        const host = process.env.HOST;
        let dados;
        let catdados;
        let condados;
        let caxdados;
        const {
            modelo,
            flx_emp,
            flx_con,
            flx_cat,
            flx_grp,
            flx_cax,
            dt_ini,
            dt_fim
        } = req.body;
        let empreendimento = '';
        let grupo = '';
        let conta = '';
        let categoria = '';
        let caixa = '';
        let filterEmp = '';
        let filterCat = '';
        let filterCon = '';
        let filterGrp = '';
        let filterCax = '';
        let filterDes = '';
        let filterDat = '';
        let cax_dataset = '';
        let cat_dataset = '';
        let con_dataset = '';
        let emp_dataset = '';
        let totaldeb = '';
        let totalcrd = '';
        let saldo = '';
        let tipo = '';
        let acao = '';

        if (flx_emp === 'Todos') filterDes = ' '
        if (flx_emp !== 'Todos') filterDes = ' WHERE id=' + flx_emp + ' '
        if (flx_emp !== 'Todos') filterEmp = ' AND emp.id=' + flx_emp + ' '
        if (flx_con !== 'Todas') filterCon = ' AND con.id=' + flx_con + ' '
        if (flx_grp !== 'Todos') filterGrp = ' AND cat.grupo=' + `'` + flx_grp + `'` + ' '
        if (flx_cat !== 'Todas') filterCat = ' AND cat.id=' + flx_cat + ' '
        if (flx_cax !== 'Todos') filterCax = ' AND cax.id=' + flx_cax + ' '
        if (dt_ini) filterDat = ' AND data BETWEEN ' + `'` + dt_ini + `'` + ' AND ' + `'` + dt_fim + `'`


        let catGroupQuery = `SELECT cat.grupo as "grupo",
                          cat.descricao
                                  AS "categoria",
                              CONCAT(
                                  'R$ ',
                                  FORMAT(
                                    SUM(
                                        CASE
                                        WHEN lct.tipo = 'S' 
                                        THEN concat('-', lct.valor)
                                          ELSE lct.valor
                                        END),
                                    2,
                                    'de_DE'))
                                  AS "total"
                        FROM empreendimentos emp,
                            contas con,
                            lancamentos lct,
                            concategorias cat
                        WHERE     lct.idconta = con.id
                              AND lct.idempreendimento = emp.id
                              AND lct.idcategoria = cat.id
                              ${filterEmp}
                              ${filterGrp}
                              ${filterCat}
                              ${filterDat}
                              AND lct.flagstatus = 1
                        GROUP BY categoria`


        let caxGroupQuery = `SELECT cax.descricao
                                        AS "caixa",
                                    CONCAT(
                                        'R$ ',
                                        FORMAT(
                                        SUM(
                                            CASE
                                            WHEN lct.tipo = 'S' 
                                            THEN concat('-', lct.valor)
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
                                WHERE     lct.idconta = con.id
                                    AND lct.idempreendimento = emp.id
                                    AND lct.idcategoria = cat.id
                                    AND lct.idcaixa = cax.id
                                    ${filterEmp}
                                    ${filterGrp}
                                    ${filterCax}
                                    ${filterDat}
                                    AND lct.flagstatus = 1
                                GROUP BY caixa`

        let conGroupQuery = `SELECT con.descricao
                                AS "conta",
                            CONCAT(
                                'R$ ',
                                FORMAT(
                                SUM(
                                    CASE
                                        WHEN lct.tipo = 'S' 
                                        THEN concat('-', lct.valor)
                                        ELSE lct.valor
                                    END),
                                2,
                                'de_DE'))
                                AS "total"
                        FROM empreendimentos emp,
                        contas con,
                        lancamentos lct,
                        concategorias cat
                        WHERE   lct.idconta = con.id
                            AND lct.idempreendimento = emp.id
                            AND lct.idcategoria = cat.id
                            ${filterEmp}
                            ${filterGrp}
                            ${filterCon}
                            ${filterDat}
                            AND lct.flagstatus = 1
                        GROUP BY conta
                        ORDER BY data ASC`;

        let sumQuery = `select
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
                        lancamentos lct, concategorias cat, caixas cax
                        where lct.idconta = con.id 
                        and lct.idempreendimento = emp.id 
                        and lct.idcategoria = cat.id
                        and lct.idcaixa = cax.id
                        ${filterEmp}
                        ${filterGrp}                        
                        ${filterCat}
                        ${filterCon}
                        ${filterDat}
                        and lct.idcategoria > 1
                        and lct.flagstatus = 1) tab
                        ) resultado`;


        jwt.verify(token, process.env.SECRET, (err) => {
            if (err) {
                //res.send(err.message)
                res.redirect('/')
            } else {

                SQL.Query(sumQuery, (dataset) => {
                    dataset.forEach(function(el, i) {
                        totaldeb = el.total_debito;
                        totalcrd = el.total_credito;
                        saldo = el.saldo;
                        tipo = el.tp;
                    });
                    if (filterDes !== ' ') {
                        SQL.Query(`SELECT descricao FROM empreendimentos ${filterDes}`, (dataset) => {
                            dataset.forEach(function(el, i) {
                                empreendimento = el.descricao;
                            });
                        });
                    } else {
                        empreendimento = 'Todos'
                    }                    

                    SQL.Query('SELECT id, descricao FROM caixas WHERE flagstatus = 1', (dataset) => {
                        cax_dataset = dataset;
                        SQL.Query('SELECT id, descricao FROM concategorias WHERE flagstatus = 1', (dataset) => {
                            cat_dataset = dataset;
                            SQL.Query('SELECT id, descricao FROM contas WHERE flagstatus = 1', (dataset) => {
                                con_dataset = dataset;
                                SQL.Query('SELECT id, descricao FROM empreendimentos WHERE flagstatus = 1', (dataset) => {
                                    emp_dataset = dataset;
                                    SQL.Query(caxGroupQuery, (dataset) => {
                                        caxdados = dataset;
                                            dataset.forEach(function(el, i) {                                        
                                                filterGrp ? grupo = el.grupo : grupo = 'Todos';
                                                filterCax ? caixa = el.caixa : caixa = 'Todos';
                                            });
                                        SQL.Query(catGroupQuery, (dataset) => {
                                            catdados = dataset;
                                            dataset.forEach(function(el, i) {                                        
                                                filterGrp ? grupo = el.grupo : grupo = 'Todos';
                                                filterCat ? categoria = el.categoria : categoria = 'Todas';
                                            });
                                            SQL.Query(conGroupQuery, (dataset) => {
                                                condados = dataset;
                                                dataset.forEach(function(el, i) {
                                                    filterCat ? categoria = el.categoria : categoria = 'Todas';
                                                    filterCon ? conta = el.conta : conta = 'Todas';
                                                });
                                                
                                                // Obtém a data/hora atual
                                                var data = new Date();
                                                // Guarda cada pedaço em uma variável
                                                var dia = data.getDate(); // 1-31
                                                var mes = data.getMonth(); // 0-11 (zero=janeiro)
                                                var ano4 = data.getFullYear(); // 4 dígitos
                                                // Formata a data e a hora (note o mês + 1)
                                                var str_data = dia + '/' + (mes + 1) + '/' + ano4;

                                                if (modelo === 'catgra') {
                                                    res.render('rel-two', {
                                                        host: host,
                                                        token: token,
                                                        dados: catdados,
                                                        categorias: cat_dataset,
                                                        contas: con_dataset,
                                                        caixas: cax_dataset,
                                                        empreendimentos: emp_dataset,
                                                        dt_ini: dt_ini.split('-').reverse().join('/'),
                                                        dt_fim: dt_fim.split('-').reverse().join('/'),
                                                        totaldeb: totaldeb,
                                                        totalcrd: totalcrd,
                                                        saldo: saldo,
                                                        flx_emp: empreendimento,
                                                        flx_grp: grupo,
                                                        flx_cat: categoria,
                                                        tipo: tipo,
                                                        acao: acao,
                                                        section: 'rel-two',
                                                    });
                                                } else if (modelo === 'cattab') {
                                                    res.render('rel-tree', {
                                                        host: host,
                                                        token: token,
                                                        dados: catdados,
                                                        categorias: cat_dataset,
                                                        contas: con_dataset,
                                                        caixas: cax_dataset,
                                                        empreendimentos: emp_dataset,
                                                        dt_ini: dt_ini.split('-').reverse().join('/'),
                                                        dt_fim: dt_fim.split('-').reverse().join('/'),
                                                        totaldeb: totaldeb,
                                                        totalcrd: totalcrd,
                                                        saldo: saldo,
                                                        flx_emp: empreendimento,
                                                        flx_grp: grupo,
                                                        flx_cat: categoria,
                                                        tipo: tipo,
                                                        acao: acao,
                                                        section: 'rel-two',
                                                    });

                                                } else if (modelo === 'congra') {

                                                    res.render('rel-four', {
                                                        host: host,
                                                        token: token,
                                                        dados: condados,
                                                        categorias: cat_dataset,
                                                        contas: con_dataset,
                                                        caixas: cax_dataset,
                                                        empreendimentos: emp_dataset,
                                                        dt_ini: dt_ini.split('-').reverse().join('/'),
                                                        dt_fim: dt_fim.split('-').reverse().join('/'),
                                                        totaldeb: totaldeb,
                                                        totalcrd: totalcrd,
                                                        saldo: saldo,
                                                        flx_emp: empreendimento,
                                                        flx_con: conta,
                                                        flx_cat: categoria,
                                                        tipo: tipo,
                                                        acao: acao,
                                                        section: 'rel-two',
                                                    });
                                                } else if (modelo === 'contab') {

                                                    res.render('rel-five', {
                                                        host: host,
                                                        token: token,
                                                        dados: condados,
                                                        categorias: cat_dataset,
                                                        contas: con_dataset,
                                                        caixas: cax_dataset,
                                                        empreendimentos: emp_dataset,
                                                        dt_ini: dt_ini.split('-').reverse().join('/'),
                                                        dt_fim: dt_fim.split('-').reverse().join('/'),
                                                        totaldeb: totaldeb,
                                                        totalcrd: totalcrd,
                                                        saldo: saldo,
                                                        flx_emp: empreendimento,
                                                        flx_con: conta,
                                                        flx_cat: categoria,
                                                        tipo: tipo,
                                                        acao: acao,
                                                        section: 'rel-two',
                                                    });
                                                } else if (modelo === 'caxtab') {

                                                    res.render('rel-six', {
                                                        host: host,
                                                        token: token,
                                                        dados: caxdados,
                                                        categorias: cat_dataset,
                                                        caixas: cax_dataset,
                                                        contas: con_dataset,
                                                        caixas: cax_dataset,
                                                        empreendimentos: emp_dataset,
                                                        dt_ini: dt_ini.split('-').reverse().join('/'),
                                                        dt_fim: dt_fim.split('-').reverse().join('/'),
                                                        totaldeb: totaldeb,
                                                        totalcrd: totalcrd,
                                                        saldo: saldo,
                                                        flx_emp: empreendimento,
                                                        flx_con: conta,
                                                        flx_cat: categoria,
                                                        flx_cax: caixa,
                                                        tipo: tipo,
                                                        acao: acao,
                                                        section: 'rel-two',
                                                    });

                                                } else if (modelo === 'caxgra') {

                                                    res.render('rel-seven', {
                                                        host: host,
                                                        token: token,
                                                        dados: caxdados,
                                                        categorias: cat_dataset,                                                        
                                                        contas: con_dataset,
                                                        caixas: cax_dataset,
                                                        empreendimentos: emp_dataset,
                                                        dt_ini: dt_ini.split('-').reverse().join('/'),
                                                        dt_fim: dt_fim.split('-').reverse().join('/'),
                                                        totaldeb: totaldeb,
                                                        totalcrd: totalcrd,
                                                        saldo: saldo,
                                                        flx_emp: empreendimento,
                                                        flx_con: conta,
                                                        flx_cat: categoria,
                                                        flx_cax: caixa,
                                                        tipo: tipo,
                                                        acao: acao,
                                                        section: 'rel-two',
                                                    });

                                                } else {
                                                //NEXT REPORT HERE
                                                }
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

}

module.exports = RelTwoController;