import {Request, Response, Router} from 'express'

// Création d'un routeur
export const userRouter = Router()

// Route pour obtenir tous les utilisateurs
// Accessible via GET /users
userRouter.get('/', (_req: Request, res: Response) => {
    res.status(200).json([
        {id: 1, name: 'Alice', email: 'alice@example.com'},
        {id: 2, name: 'Bob', email: 'bob@example.com'}
    ])
})

// Route pour obtenir un utilisateur spécifique
// Accessible via GET /users/:id
userRouter.get('/:id', (req: Request, res: Response) => {
    const userId = req.params.id
    res.status(200).json({
        id: parseInt(userId),
        name: 'John Doe',
        email: 'john@example.com'
    })
})

// Route pour créer un utilisateur
// Accessible via POST /users
userRouter.post('/', (req: Request, res: Response) => {
    const {name, email} = req.body
    res.status(201).json({
        message: 'Utilisateur créé',
        id: 3,
        name,
        email
    })
})
