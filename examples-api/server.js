import Koa from 'koa'
import Router from '@koa/router'

const app = new Koa()
const router = new Router()

const examples = [
  { id: 1, title: 'Installer Koa', done: true },
  { id: 2, title: 'Écrire une première route', done: true },
  { id: 3, title: 'Ajouter GET /examples/:id', done: false },
]

app.use(async (ctx, next) => {
  const debut = Date.now()
  await next()
  const duree = Date.now() - debut
  ctx.set('X-Response-Time', `${duree}ms`)
  console.log(`${ctx.method} ${ctx.path} -> ${ctx.status} (${duree} ms)`)
})

router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' }
})

router.get('/examples', (ctx) => {
  const { done } = ctx.query

  if (done === undefined) {
    ctx.body = examples
    return
  }

  if (done !== 'true' && done !== 'false') {
    ctx.status = 400
    ctx.body = { error: 'Le paramètre done doit valoir true ou false' }
    return
  }

  ctx.body = examples
              .filter(
                (e) => e.done === (done === 'true')
              )
})

// Déclarée avant /examples/:id, sinon "count" serait pris pour un id
let count = 0
router.get('/examples/count', (ctx) => {
  count++
  ctx.body = { count }
})

router.get('/examples/:id', (ctx) => {
  const id = Number(ctx.params.id)
  const example = examples.find((e) => e.id === id)

  if (!example) {
    ctx.status = 404
    ctx.body = { error: 'Exemple introuvable' }
    return
  }

  ctx.body = example
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000')
})
