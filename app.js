const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const app = express()
const port = 3000 //porta padrão
const cors = require('cors')
const router = express.Router()

// Importação dos controllers
const LogController = require('./controllers/log-controller')
const Access = new LogController()

const CliController = require('./controllers/cli-controller')
const Cliente = new CliController()

const EmpController = require('./controllers/emp-controller')
const Empreendimento = new EmpController()

const LotController = require('./controllers/lot-controller')
const Lote = new LotController()

const CotController = require('./controllers/cot-controller')
const Cota = new CotController()

const ConCatController = require('./controllers/concat-controller')
const ConCategoria = new ConCatController()

const ConController = require('./controllers/con-controller')
const Conta = new ConController()

const CaxController = require('./controllers/cax-controller')
const Caixa = new CaxController()

const LctController = require('./controllers/lct-controller')
const Lancamento = new LctController()

const FlxController = require('./controllers/flx-controller')
const Fluxo = new FlxController()

const RelOneController = require('./controllers/relone-controller')
const RelAnalitico = new RelOneController()

const RelTwoController = require('./controllers/reltwo-controller')
const RelSintetico = new RelTwoController()

// Libera acesso CORS para qualquer domínio. Substituir * pelo domínio desejado.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  app.use(cors())
  next()
})

//configurando o BODYPARSER, ROUTER, EJS e STATIC ROUTE.
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
) //para usar quando vem de um FORM
app.use('/', router)
app.use(express.static('public'))
app.use(express.static('public/img'))

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// Controle de Rotas (Migrar para Routes)
router.post('/login', Access.PostUserToken)
router.get('/logout', Access.PostUserLogout)

//Página Inicial
router.get('/admin/:token', Cliente.GetListaAdmin)

//Clientes
router.get('/clientes/:token/:id?', Cliente.GetListaClientes)
router.get('/cliente/include/:token', Cliente.GetCadastraCliente)
router.post('/clientes/:token/', Cliente.PostCadastraClientes)
router.get('/cliente/delete/:token/:id', Cliente.GetDeletaCliente)
router.post('/cliente/delete/:token/:id', Cliente.PostDeletaCliente)
router.get('/cliente/update/:token/:id', Cliente.GetAtualizaCliente)
router.post('/cliente/update/:token/:id', Cliente.PostAtualizaCliente)

//Empreendimentos
router.get('/empreendimentos/:token/:id?', Empreendimento.GetListaEmpreendimentos)
router.get('/empreendimento/include/:token', Empreendimento.GetCadastraEmpreendimento)
router.post('/empreendimentos/:token/', Empreendimento.PostCadastraEmpreendimento)
router.get('/empreendimento/delete/:token/:id', Empreendimento.GetDeletaEmpreendimento)
router.post('/empreendimento/delete/:token/:id', Empreendimento.PostDeletaEmpreendimento)
router.get('/empreendimento/update/:token/:id', Empreendimento.GetAtualizaEmpreendimento)
router.post('/empreendimento/update/:token/:id', Empreendimento.PostAtualizaEmpreendimento)

//Lotes
router.get('/lotes/:token/:id?', Lote.GetListaLotes)
router.get('/lote/include/:token', Lote.GetCadastraLote)
router.post('/lotes/:token', Lote.PostCadastraLote)
router.get('/lote/delete/:token/:id', Lote.GetDeletaLote)
router.post('/lote/delete/:token/:id', Lote.PostDeletaLote)
router.get('/lote/update/:token/:id', Lote.GetAtualizaLote)
router.post('/lote/update/:token/:id', Lote.PostAtualizaLote)
router.get('/lote/reserva/:token/:id', Lote.GetReservaLote)
router.post('/lote/reserva/:token/:id', Lote.PostReservaLote)
router.get('/lote/venda/:token/:id', Lote.GetVendaLote)
router.post('/lote/venda/:token/:id', Lote.PostVendaLote)
router.get('/lote/tabela/:token', Lote.GetListaTabela)
router.post('/lote/tabela/:token', Lote.PostListaTabela)
router.get('/lote/reajuste/:token', Lote.GetReajuste)
router.post('/lote/reajuste/:token', Lote.PostReajuste)

//Cotas
router.get('/cotas/:token/:id?', Cota.GetListaCotas)
router.get('/cota/include/:token', Cota.GetCadastraCota)
router.post('/cotas/:token', Cota.PostCadastraCota)
router.get('/cota/delete/:token/:id', Cota.GetDeletaCota)
router.post('/cota/delete/:token/:id', Cota.PostDeletaCota)
router.get('/cota/update/:token/:id', Cota.GetAtualizaCota)
router.post('/cota/update/:token/:id', Cota.PostAtualizaCota)
router.get('/cota/venda/:token/:id', Cota.GetVendaCota)
router.post('/cota/venda/:token/:id', Cota.PostVendaCota)

//Categorias Contas
router.get('/concategorias/:token/:id?', ConCategoria.GetListaCategorias)
router.get('/concategoria/include/:token', ConCategoria.GetCadastraCategoria)
router.post('/concategorias/:token', ConCategoria.PostCadastraCategoria)
router.get('/concategoria/delete/:token/:id', ConCategoria.GetDeletaCategoria)
router.post('/concategoria/delete/:token/:id', ConCategoria.PostDeletaCategoria)
router.get('/concategoria/update/:token/:id', ConCategoria.GetAtualizaCategoria)
router.post('/concategoria/update/:token/:id', ConCategoria.PostAtualizaCategoria)

//Contas
router.get('/contas/:token/:id?', Conta.GetListaContas)
router.get('/conta/include/:token', Conta.GetCadastraConta)
router.post('/contas/:token', Conta.PostCadastraConta)
router.get('/conta/delete/:token/:id', Conta.GetDeletaConta)
router.post('/conta/delete/:token/:id', Conta.PostDeletaConta)
router.get('/conta/update/:token/:id', Conta.GetAtualizaConta)
router.post('/conta/update/:token/:id', Conta.PostAtualizaConta)

//Caixas
router.get('/caixas/:token/:id?', Caixa.GetListaCaixas)
router.get('/caixa/include/:token', Caixa.GetCadastraCaixa)
router.post('/caixas/:token', Caixa.PostCadastraCaixa)
router.get('/caixa/delete/:token/:id', Caixa.GetDeletaCaixa)
router.post('/caixa/delete/:token/:id', Caixa.PostDeletaCaixa)
router.get('/caixa/update/:token/:id', Caixa.GetAtualizaCaixa)
router.post('/caixa/update/:token/:id', Caixa.PostAtualizaCaixa)
router.get('/caixa/transfer/:token', Caixa.GetTransfer)
router.post('/caixa/transfer/:token', Caixa.PostTransfer)


//Lançamentos
router.get('/lancamentos/:token/:id?', Lancamento.GetListaLancamentos)
router.get('/lancamento/include/:token', Lancamento.GetCadastraLancamento)
router.post('/lancamentos/:token', Lancamento.PostCadastraLancamento)
router.get('/lancamento/delete/:token/:id', Lancamento.GetDeletaLancamento)
router.post('/lancamento/delete/:token/:id', Lancamento.PostDeletaLancamento)
router.get('/lancamento/update/:token/:id', Lancamento.GetAtualizaLancamento)
router.post('/lancamento/update/:token/:id', Lancamento.PostAtualizaLancamento)

//Fluxo de Caixa
router.get('/fluxo/:token/:id?', Fluxo.GetListaFluxo)
router.post('/fluxo/:token/:id?', Fluxo.PostListaFluxo)

//Outros Relatórios
router.get('/relone/:token/:id?', RelAnalitico.GetListaRel)
router.post('/relone/:token/:id?', RelAnalitico.PostListaRel)
router.get('/reltwo/:token/:id?', RelSintetico.GetListaRel)
router.post('/reltwo/:token/:id?', RelSintetico.PostListaRel)

//Dados de COTA, antes de vender lotes. Teste de acesso por AJAX.
router.get('/venda/:token/:cli?/:emp?', Lote.GetBuscaDados)
router.get('/reserva/:token/:lote', Lote.GetBuscaReservas)
router.get('/cancela/:token/:lote', Lote.GetCancelaReserva)

//inicia o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`)
})
