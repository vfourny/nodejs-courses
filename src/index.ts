import 'dotenv/config'
import express from 'express'
import {userRouter} from "@/user/user.route";
import {authRouter} from "@/auth/auth.route";

export const app = express()

const port = 3000

// Middleware pour parser le JSON
app.use(express.json())

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
