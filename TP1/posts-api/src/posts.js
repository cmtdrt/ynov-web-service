import { readFileSync } from 'node:fs'

// Lire le fichier json de départ + stocker les posts en mémoire
const seedFile = new URL('../posts.seed.json', import.meta.url)
const posts = JSON.parse(readFileSync(seedFile, 'utf8'))

// Prochain id de post à attribuer
let nextId = Math.max(...posts.map((post) => post.id)) + 1

// Construit un post avec les champs dans le même ordre que le jeu de départ.
function buildPost(id, fields) {
  return { postId: fields.postId, id, name: fields.name, email: fields.email, body: fields.body }
}

export function findAll() {
  return posts
}

export function findByPostId(postId) {
  return posts.filter((post) => post.postId === postId)
}

export function findById(id) {
  return posts.find((post) => post.id === id)
}

export function create(fields) {
  const post = buildPost(nextId, fields)
  nextId++ // On incrémente le prochain id pour le prochain post
  posts.push(post)
  return post
}

export function replace(id, fields) {
  const index = posts.findIndex((post) => post.id === id)
  posts[index] = buildPost(id, fields)
  return posts[index]
}

export function update(id, fields) {
  return Object.assign(findById(id), fields)
}

export function remove(id) {
  const index = posts.findIndex((post) => post.id === id)
  posts.splice(index, 1)
}
