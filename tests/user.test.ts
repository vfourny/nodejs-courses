import {describe, expect, it} from 'vitest'
import request from 'supertest'
import {prismaMock} from "./vitest.setup";
import {app} from "@/index";

describe('GET /users', () => {
    it('should return an array of users', async () => {
        // Mock de la réponse Prisma
        prismaMock.user.findMany.mockResolvedValue([
            {
                id: 1,
                name: 'Alice',
                email: 'alice@example.com',
                password: 'hashedpassword',
            },
            {
                id: 2,
                name: 'Bob',
                email: 'bob@example.com',
                password: 'hashedpassword',
            },
        ])

        // Requête HTTP via supertest
        const response = await request(app).get('/users')

        // Assertions
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)
        expect(response.body[0]).toHaveProperty('name', 'Alice')
    })

    it('should return empty array when no users', async () => {
        prismaMock.user.findMany.mockResolvedValue([])

        const response = await request(app).get('/users')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
    })
})

describe('POST /users', () => {
    it('should create a new user', async () => {
        const newUser = {
            id: 1,
            name: 'Charlie',
            email: 'charlie@example.com',
            password: 'hashedpassword',
        }

        prismaMock.user.create.mockResolvedValue(newUser)

        const response = await request(app)
            .post('/users')
            .send({name: 'Charlie', email: 'charlie@example.com', password: 'password123'})

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message', 'Utilisateur créé')
        expect(response.body.user).toHaveProperty('name', 'Charlie')
    })

    it('should return 400 for invalid data', async () => {
        // Mock d'une erreur Prisma (par exemple, email déjà existant)
        prismaMock.user.create.mockRejectedValue(new Error('Unique constraint failed'))

        const response = await request(app)
            .post('/users')
            .send({name: 'Charlie', email: 'existing@example.com', password: 'password123'})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
    })
})

describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashedpassword',
        })

        const response = await request(app).get('/users/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('name', 'Alice')
        expect(response.body).toHaveProperty('email', 'alice@example.com')
    })

    it('should return 404 when user not found', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null)

        const response = await request(app).get('/users/999')

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error', 'Utilisateur non trouvé')
    })
})
