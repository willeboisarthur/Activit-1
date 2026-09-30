const Product = ('./models/produc_model.js');

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
        const product = await Product.create();
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

exports.getById = (req, res) => res.status(200).json({ project: req.resource });

exports.update = async (req,res,next) => {
    try{
        const updateRessource = await req.resource.update(pick(req.body));
        return res.status(200).json(updatedResource);
    }
    catch(err){
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Données invalides ou manquantes.", details: err.message });
        }
        return res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
}

exports.delete = async (req,res,next) => {
    try{
        await req.resource.destroy();
        res.status(200).json({ message: 'Projet supprimé.' });
    }
    catch(err){
        if(err.name === 'SequelizeForeignKeyConstraintError'){
            return res.status(409).json({ error: "Une erreur est survenue lors de la suppression." });
        }
        else{
            return res.status(500).json({ error: "Erreur lors de la suppression." });
        }
    }
}