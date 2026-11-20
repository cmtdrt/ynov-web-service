// Format d'adresse e-mail valide
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Vérifie si la valeur est un texte de longueur entre min et max
function isTextOfLength(value, min, max) {
  return typeof value === 'string' && value.length >= min && value.length <= max
}

// Vérifie si la valeur est un entier positif
export function isPositiveInteger(value) {
  return Number.isInteger(value) && value >= 1
}

// Les quatre champs que le client peut envoyer, chacun avec sa règle et son message d'erreur.
const RULES = {
  postId: {
    isValid: isPositiveInteger,
    message: 'postId doit être un entier supérieur ou égal à 1',
  },
  name: {
    isValid: (value) => isTextOfLength(value, 1, 100),
    message: 'name doit être un texte de 1 à 100 caractères',
  },
  email: {
    isValid: (value) => isTextOfLength(value, 1, 100) && EMAIL_FORMAT.test(value),
    message: 'email doit être une adresse e-mail valide de 100 caractères au plus',
  },
  body: {
    isValid: (value) => isTextOfLength(value, 1, 500),
    message: 'body doit être un texte de 1 à 500 caractères',
  },
}

const ALLOWED_FIELDS = Object.keys(RULES)

// Règles partagées par POST, PUT (tous les champs requis) et PATCH (partial : au moins un champ).
// Renvoie le message de la première erreur trouvée, ou null si le corps est valide.
export function validatePost(data, { partial = false } = {}) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return 'Le corps de la requête doit être un objet JSON valide'
  }

  // Récupère les champs du corps de la requête
  const fields = Object.keys(data)

  if (partial && fields.length === 0) {
    return `Au moins un champ est requis parmi : ${ALLOWED_FIELDS.join(', ')}`
  }

  const unknownField = fields.find((field) => !ALLOWED_FIELDS.includes(field))
  if (unknownField) {
    return `Champ non autorisé : ${unknownField}`
  }

  if (!partial) {
    const missingField = ALLOWED_FIELDS.find((field) => !fields.includes(field))
    if (missingField) {
      return `Champ manquant : ${missingField}`
    }
  }

  const invalidField = fields.find((field) => !RULES[field].isValid(data[field]))
  if (invalidField) {
    return RULES[invalidField].message
  }

  return null
}
