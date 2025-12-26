import {Request, Response, Router} from 'express'
import bcrypt from 'bcrypt'
import prisma from "@/client";
import {authenticateToken} from "@/middlewares/auth.middleware";

/**
 * Router pour les routes de gestion des utilisateurs
 * @type {Router}
 */
export const userRouter = Router()


/**
 * Récupère tous les utilisateurs de la base de données
 *
 * @route GET /users
 *
 * @returns {Response} 200 - Liste de tous les utilisateurs
 * @returns {Array<object>} 200.users - Tableau des utilisateurs avec leurs informations complètes
 */
userRouter.get('/', async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
})

/**
 * Récupère un utilisateur spécifique par son ID
 *
 * @route GET /users/:id
 *
 * @param {string} req.params.id - ID de l'utilisateur à récupérer
 *
 * @returns {Response} 200 - Utilisateur trouvé
 * @returns {object} 200.user - Informations complètes de l'utilisateur
 * @returns {Response} 404 - Utilisateur non trouvé
 */
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

/**
 * Crée un nouvel utilisateur (Route protégée)
 *
 * Cette route nécessite une authentification JWT valide.
 * Le mot de passe est automatiquement haché avec bcrypt (10 rounds) avant stockage.
 *
 * @route POST /users
 * @middleware authenticateToken - Requiert un token JWT valide
 *
 * @param {string} req.body.name - Nom de l'utilisateur
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe en clair (sera haché)
 *
 * @returns {Response} 201 - Utilisateur créé avec succès
 * @returns {object} 201.user - Informations de l'utilisateur créé (sans le mot de passe)
 * @returns {Response} 400 - Erreur de validation (email déjà utilisé, etc.)
 * @returns {Response} 401 - Token manquant
 * @returns {Response} 403 - Token invalide
 */
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
