import {Request, Response, Router} from 'express'
import prisma from './client' // Import du client singleton

export const userRouter = Router()

// GET: Récupérer tous les utilisateurs
// Accessible via GET /users
userRouter.get('/', async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
})

// GET: Récupérer un utilisateur par ID
// Accessible via GET /users/:id
userRouter.get('/:id', async (req: Request, res: Response) => {
    const {id} = req.params
    const user = await prisma.user.findUnique({
        where: {id: parseInt(id)},
    })

    if (!user) {
        return res.status(404).json({error: 'Utilisateur non trouvé'})
    }

    res.status(200).json(user)
})

// POST: Créer un utilisateur
// Accessible via POST /users
userRouter.post('/', async (req: Request, res: Response) => {
    const {name, email} = req.body

    try {
        const user = await prisma.user.create({
            data: {name, email},
        })

        res.status(201).json({
            message: 'Utilisateur créé',
            ...user,
        })
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
})
