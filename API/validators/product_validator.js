const Joi = require('joi');

const fields = {
    name: Joi.string().trim().max(100),
    description: Joi.string().trim().max(1000).allow('', null),
    prix: Joi.number().positive(),
    categorie: Joi.string().trim().max(100)
};

// Ajout : name, prix et categorie obligatoires
exports.create = Joi.object({
    ...fields,
    name: fields.name.required(),
    prix: fields.prix.required(),
    categorie: fields.categorie.required()
});

// Modification : tout est optionnel, mais au moins un champ
exports.update = Joi.object(fields).min(1);

// Paramètre d'URL /:id
exports.id = Joi.object({
    id: Joi.number().integer().positive().required()
});