const Product = require('../models/product_model');

exports.list = async (req,res,next) => {
    try{
        res.status(200).json({ products: await Product.findAll() });
    }
    catch(err){
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des données"});
    }
}

exports.create = async (req,res,next) => {
    try{
        const product = await Product.create(req.body);
        res.status(201).json({product});
    }
    catch(err){
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: "Données invalides." });
        }
        else{
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
}

exports.getById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Produit non trouvé." });
        }
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération." });
    }
};

exports.update = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Produit non trouvé." });
        }

        const updatedProduct = await product.update(req.body);
        return res.status(200).json(updatedProduct);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: "Données invalides.", details: err.message });
        }
        res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
};

exports.delete = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Produit non trouvé." });
        }

        await product.destroy();
        res.status(200).json({ message: "Produit supprimé." });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
};