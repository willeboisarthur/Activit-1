-process.env.JWT_SECRET = 'test_secret_key';
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
                models[name] = { name, attrs, findOne: jest.fn(), create: jest.fn(), destroy: jest.fn(), update: jest.fn() };
                return models[name];
            }),
        },
    };
});

jest.mock('../database/sync', () => jest.fn().mockResolvedValue(undefined));

jest.mock('../models/user_model', () => {
    const users = [];
    return {
        findOne: jest.fn(({ where }) => {
            return Promise.resolve(users.find((u) => u.username === where.username) || null);
        }),
        create: jest.fn(async (data) => {
            const user = { id_user: users.length + 1, ...data };
            users.push(user);
            return user;
        }),
        destroy: jest.fn(async () => {
            users.length = 0;
            return { affectedRows: 0 };
        }),
        __mockUsers: users,
    };
});

const request = require('supertest');
const app = require('../app');
const User = require('../models/user_model');

beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true, force: true });
    User.__mockUsers.length = 0;
    User.findOne.mockClear();
    User.create.mockClear();
});

afterAll(async () => {
    User.__mockUsers.length = 0;
});

describe('POST /auth/register - ajouter un utilisateur', () => {
    test('devrait créer un utilisateur avec succès', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'Motdepasse123' });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Utilisateur créé avec succès');
        expect(User.create).toHaveBeenCalledWith(
            expect.objectContaining({ username: 'testuser' })
        );
    });

    test('devrait rejeter si username manquant', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ password: 'Motdepasse123' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Tous les champs sont requis');
    });

    test('devrait rejeter si password manquant', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Tous les champs sont requis');
    });

    test('devrait rejeter si lutilisateur existe déjà', async () => {
        await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'Motdepasse123' });

        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'Motdepasse123' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("L'utilisateur existe déjà");
    });
});
