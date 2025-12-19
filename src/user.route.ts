import {Router} from 'express'
import Database from 'better-sqlite3'

export const userRouter = Router()

const db = new Database('./database.db')

// GET: Récupérer tous les utilisateurs
// Accessible via GET /users
userRouter.get('/', (_req, res) => {
    const users = db.prepare('SELECT * FROM users').all()
    res.json(users)
})

// GET: Récupérer un utilisateur par ID
// Accessible via GET /users/:id
userRouter.get('/:id', (req, res) => {
    const {id} = req.params
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)

    if (!user) {
        return res.status(404).json({error: 'Utilisateur non trouvé'})
    }

    res.json(user)
})

// POST: Créer un utilisateur
// Accessible via POST /users
userRouter.post('/', (req, res) => {
    const {name, email} = req.body

    try {
        const result = db
            .prepare('INSERT INTO users (name, email) VALUES (?, ?)')
            .run(name, email)
        res.status(201).json({
            message: 'Utilisateur créé',
            id: result.lastInsertRowid,
            name,
            email,
        })
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
})
