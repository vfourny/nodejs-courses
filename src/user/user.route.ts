import {Request, Response, Router} from 'express'
import bcrypt from 'bcrypt'
import prisma from "@/client";
import {authenticateToken} from "@/auth/auth.middleware";

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

// Route protégée : seuls les utilisateurs authentifiés peuvent créer un utilisateur
// Accessible via POST /users
userRouter.post('/', authenticateToken, async (req: Request, res: Response) => {
    const {name, email, password} = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {name, email, password: hashedPassword},
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        res.status(201).json({
            message: 'Utilisateur créé',
            user,
        })
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
})
