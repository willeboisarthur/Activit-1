const messages = {
    'any.required': '{{#label}} est requis',
    'any.only': '{{#label}} a une valeur invalide',
    'string.base': '{{#label}} doit être du texte',
    'string.empty': '{{#label}} ne peut pas être vide',
    'string.min': '{{#label}} doit contenir au moins {{#limit}} caractères',
    'string.max': '{{#label}} doit contenir au maximum {{#limit}} caractères',
    'number.base': '{{#label}} doit être un nombre',
    'number.positive': '{{#label}} doit être supérieur à 0',
    'number.integer': '{{#label}} doit être un entier',
    'object.min': 'Au moins un champ est requis'
};

// Valide req.body (par défaut) ou req.params avec un schéma Joi
const validate = (schema, source = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[source] ?? {}, {
        abortEarly: false,
        stripUnknown: true,
        messages
    });

    if (error) {
        return res.status(400).json({
            message: 'Données invalides',
            errors: error.details.map((detail) => detail.message)
        });
    }

    req[source] = value;
    next();
};

module.exports = validate;