process.env.JWT_SECRET = 'test_secret_key';
process.env.SALT_ROUNDS = '10';
process.env.NODE_ENV = 'test';

jest.mock('../database/connexion', () => {
    const models = {};
    return {
        connect: jest.fn().mockResolvedValue(undefined),
        bdd: {
            authenticate: jest.fn().mockResolvedValue(undefined),
            sync: jest.fn().mockResolvedValue(undefined),
            define: jest.fn((name, attrs) => {
                models[name] = {
                    name,
                    attrs,
                    findAll: jest.fn(),
                    findByPk: jest.fn(),
                    create: jest.fn(),
                    destroy: jest.fn(),
                    update: jest.fn(),
                };
                return models[name];
            }),
        },
    };
});

jest.mock('../database/sync', () => jest.fn().mockResolvedValue(undefined));

jest.mock('../middleware/auth_middleware.js', () => ({
    verifyToken: (req, res, next) => {
        req.user = { id_user: 1, role: 'admin' };
        next();
    },
    requireRole: (...roles) => (req, res, next) => next(),
}));

jest.mock('../models/product_model', () => {
    const products = [];
    return {
        findAll: jest.fn(async () => [...products]),
        findByPk: jest.fn(async (id) => products.find((p) => p.id_product === Number(id)) || null),
        create: jest.fn(async (data) => {
            if (!data.name || !data.prix || !data.categorie) {
                const err = new Error('Validation error');
                err.name = 'SequelizeValidationError';
                throw err;
            }
            const product = { id_product: products.length + 1, ...data };
            products.push(product);
            return product;
        }),
        destroy: jest.fn(async () => {
            products.length = 0;
            return { affectedRows: 0 };
        }),
        __mockProducts: products,
    };
});

const request = require('supertest');
const app = require('../app');
const Product = require('../models/product_model');

beforeEach(async () => {
    Product.__mockProducts.length = 0;
    Product.findAll.mockClear();
    Product.findByPk.mockClear();
    Product.create.mockClear();
});

afterAll(async () => {
    Product.__mockProducts.length = 0;
});

describe('Produits - API /product', () => {
    test('GET /product - devrait lister tous les produits', async () => {
        await Product.create({ name: 'Produit A', description: 'Desc A', prix: 10.99, categorie: 'Cat A' });
        await Product.create({ name: 'Produit B', description: 'Desc B', prix: 20.50, categorie: 'Cat B' });

        const res = await request(app).get('/product');

        expect(res.status).toBe(200);
        expect(res.body.products.length).toBe(2);
    });

    test('POST /product - devrait créer un produit', async () => {
        const res = await request(app)
            .post('/product')
            .send({ name: 'Nouveau Produit', description: 'Description', prix: 15.00, categorie: 'Électronique' });

        expect(res.status).toBe(201);
        expect(res.body.product.name).toBe('Nouveau Produit');
        expect(Product.create).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Nouveau Produit' })
        );
    });

    test('POST /product - devrait rejeter si champs manquants', async () => {
        const res = await request(app)
            .post('/product')
            .send({ name: 'Produit Incomplet' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Données invalides.');
    });

    test('GET /product/:id - devrait récupérer un produit par ID', async () => {
        const created = await Product.create({ name: 'Produit Test', description: 'Desc', prix: 5.00, categorie: 'Test' });

        const res = await request(app).get(`/product/${created.id_product}`);

        expect(res.status).toBe(200);
        expect(res.body.product.name).toBe('Produit Test');
    });

    test('GET /product/:id - devrait retourner 404 si produit introuvable', async () => {
        Product.findByPk.mockResolvedValueOnce(null);

        const res = await request(app).get('/product/999');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Produit non trouvé.');
    });

    test('PATCH /product/:id - devrait mettre à jour un produit', async () => {
        const created = await Product.create({ name: 'Avant', description: 'Desc', prix: 5.00, categorie: 'Cat' });
        Product.findByPk.mockResolvedValueOnce({
            ...created,
            update: jest.fn(async (data) => ({ ...created, ...data })),
        });

        const res = await request(app)
            .patch(`/product/${created.id_product}`)
            .send({ name: 'Après' });

        expect(res.status).toBe(200);
    });

    test('DELETE /product/:id - devrait supprimer un produit', async () => {
        const created = await Product.create({ name: 'À supprimer', description: 'Desc', prix: 5.00, categorie: 'Cat' });
        Product.findByPk.mockResolvedValueOnce({
            ...created,
            destroy: jest.fn(async () => 1),
        });

        const res = await request(app).delete(`/product/${created.id_product}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Produit supprimé.');
    });
});
