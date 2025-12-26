import 'dotenv/config'
import express from 'express'
import {userRouter} from "@/routes/user.route";
import {authRouter} from "@/routes/auth.route";
import swaggerUi from 'swagger-ui-express'
import {swaggerDocument} from './docs'
import * as http from "node:http";
import {ChatServer} from "@/socket/Chat";

const app = express()
const server = http.createServer(app);

// Initialiser le serveur de chat avec la classe
new ChatServer(server)

const port = 3000

// Middleware pour parser le JSON
app.use(express.json())

// Documentation Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Documentation"
}))


// Route Express classique
app.get('/', (_req, res) => {
    res.send('Serveur Socket.IO actif')
})

// Autres middlewares et routes Express
app.use('/users', userRouter)
app.use('/auth', authRouter)

server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})
