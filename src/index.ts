import express from 'express'
import {userRouter} from './user.route'
import Database from "better-sqlite3";

export const app = express()

const port = 3000

const db = new Database('./database.db')

// Création d'une table utilisateurs
db.exec(`
    CREATE TABLE IF NOT EXISTS users
    (
        id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        name
        TEXT
        NOT
        NULL,
        email
        TEXT
        UNIQUE
        NOT
        NULL
    )
`)

// Middleware pour parser le JSON
app.use(express.json())

// Route d'accueil
app.get('/', (_req, res) => {
    res.status(200).send('Bienvenue sur le serveur HTTP')
})

// Utilisation du router utilisateur
// Toutes les routes définies dans userRouter seront préfixées par /users
app.use('/users', userRouter)

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Mon serveur démarre sur le port ${port}`)
})
