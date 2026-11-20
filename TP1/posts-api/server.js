import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { handleBodyError, handleErrors } from './src/errors.js'
import router from './src/routes.js'

const PORT = 3000

const app = new Koa()

app.use(handleErrors)
app.use(bodyParser({ enableTypes: ['json'], onerror: handleBodyError }))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
