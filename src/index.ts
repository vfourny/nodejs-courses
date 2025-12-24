import 'dotenv/config'
import express from 'express'
import {userRouter} from "@/routes/user.route";
import {authRouter} from "@/routes/auth.route";
import swaggerUi from 'swagger-ui-express'
import {swaggerDocument} from './docs'

/**
 * Application Express principale
 *
 * Configure et exporte l'application Express avec :
 * - Middleware JSON
 * - Routes d'authentification (/auth)
 * - Routes utilisateur (/users)
 *
 * @type {Express}
 */
export const app = express()

const port = 3000

// Middleware pour parser le JSON
app.use(express.json())

// Routes de l'API
app.use('/auth', authRouter)
app.use('/users', userRouter)

// Documentation Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Documentation"
}))


// Route d'accueil
app.get('/', (_req, res) => {
    res.status(200).send('Bienvenue sur le serveur HTTP')
})

// Utilisation du router utilisateur
// Toutes les routes définies dans userRouter seront préfixées par /users
app.use('/users', userRouter)
app.use('/auth', authRouter)

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Mon serveur démarre sur le port ${port}`)
})
