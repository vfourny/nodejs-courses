import http from 'http'

// Création du serveur HTTP
const server = http.createServer((req, res) => {
    // Récupération de l'URL et de la méthode de la requête
    const url = req.url
    const method = req.method

    // Gestion de la route /users
    if (url === '/users' && method === 'GET') {
        // Simulation d'une liste d'utilisateurs
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(
            JSON.stringify([
                {id: 1, name: 'Alice', email: 'alice@example.com'},
                {id: 2, name: 'Bob', email: 'bob@example.com'},
            ]),
        )
    }
    // Gestion de la route /users/:id pour obtenir un utilisateur spécifique
    else if (url?.startsWith('/users/') && method === 'GET') {
        const userId = url.split('/')[2]
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(
            JSON.stringify({
                id: parseInt(userId),
                name: 'John Doe',
                email: 'john@example.com',
            }),
        )
    }
    // Gestion de la route /users avec POST
    else if (url === '/users' && method === 'POST') {
        // Récupération du body de la requête
        let payload = ''
        req.on('data', (body) => {
            payload += body.toString()
        })
        req.on('end', () => {
            const userData = JSON.parse(payload)
            res.writeHead(201, {'Content-Type': 'application/json'})
            res.end(
                JSON.stringify({
                    message: 'Utilisateur créé',
                    id: 3,
                    name: userData.name,
                    email: userData.email,
                }),
            )
        })
    }
    // Gestion de la route racine
    else if (url === '/' && method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.end('Bienvenue sur le serveur HTTP\n')
    }
    // Route non trouvée
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('Route non trouvée\n')
    }
})

// Démarrage du serveur sur le port 3000
server.listen(3000, () => {
    console.log("Serveur en cours d'écoute sur le port 3000...")
})
