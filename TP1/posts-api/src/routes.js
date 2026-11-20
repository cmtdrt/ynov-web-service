import Router from '@koa/router'
import * as posts from './posts.js'
import { isPositiveInteger, validatePost } from './validation.js'

const router = new Router()

// Vérifie si le corps de la requête est valide
// Renvoyer une erreur 400 si ce n'est pas le cas
function throwIfInvalid(ctx, options) {
  const error = validatePost(ctx.request.body, options)
  if (error) {
    ctx.throw(400, error)
  }
}

// Pour chaque route avec :id, on cherche le post avant d'exécuter la route.
router.param('id', (value, ctx, next) => {
  const id = Number(value)
  if (!posts.findById(id)) {
    ctx.throw(404, 'Post introuvable')
  }
  ctx.state.id = id
  return next()
})

router.get('/posts', (ctx) => {
  if (ctx.query.postId === undefined) {
    ctx.body = posts.findAll()
    return
  }

  const postId = Number(ctx.query.postId)
  if (!isPositiveInteger(postId)) {
    ctx.throw(400, 'postId doit être un entier supérieur ou égal à 1')
  }
  ctx.body = posts.findByPostId(postId)
})

router.get('/posts/:id', (ctx) => {
  ctx.body = posts.findById(ctx.state.id)
})

router.post('/posts', (ctx) => {
  throwIfInvalid(ctx)
  const post = posts.create(ctx.request.body)
  ctx.status = 201
  ctx.set('Location', `/posts/${post.id}`)
  ctx.body = post
})

router.put('/posts/:id', (ctx) => {
  throwIfInvalid(ctx)
  ctx.body = posts.replace(ctx.state.id, ctx.request.body)
})

router.patch('/posts/:id', (ctx) => {
  throwIfInvalid(ctx, { partial: true })
  ctx.body = posts.update(ctx.state.id, ctx.request.body)
})

router.delete('/posts/:id', (ctx) => {
  posts.remove(ctx.state.id)
  ctx.status = 204
})

export default router
