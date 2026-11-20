// Messages des réponses d'erreur que Koa et le routeur produisent sans corps.
const DEFAULT_MESSAGES = {
  404: 'Route introuvable',
  405: 'Méthode non autorisée pour cette route',
}

// Toutes les erreurs passent par ici et deviennent { "error": "…" }.
export async function handleErrors(ctx, next) {
  try {
    await next()

    // Rajouter un message d'erreur s'il n'y a pas de body 
    if (ctx.status >= 400 && ctx.body === undefined) {
      ctx.throw(ctx.status, DEFAULT_MESSAGES[ctx.status] ?? ctx.message)
    }
  } catch (err) {
    ctx.status = err.status ?? 500
    // err.expose vaut true pour les erreurs client (4xx)
    ctx.body = { error: err.expose ? err.message : 'Erreur interne du serveur' }

    if (ctx.status >= 500) {
      ctx.app.emit('error', err, ctx)
    }
  }
}

// Renvoyer un message d'erreur propre
export function handleBodyError(err, ctx) {
  ctx.throw(err.status, 'Le corps de la requête doit être un objet JSON valide')
}
