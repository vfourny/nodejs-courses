import {PrismaClient} from '../src/generated/prisma/index.js'
import {PrismaBetterSqlite3} from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({adapter})

async function main() {
    // Suppression de tous les utilisateurs
    await prisma.user.deleteMany()

    // Réinitialisation de l'auto-incrémentation (spécifique à SQLite)
    await prisma.$executeRaw`DELETE
                             FROM sqlite_sequence
                             WHERE name = 'User'`

    // Création de plusieurs utilisateurs avec createMany
    await prisma.user.createMany({
        data: [
            {
                name: 'Alice',
                email: 'alice@example.com',
            },
            {
                name: 'Bob',
                email: 'bob@example.com',
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
            },
        ],
    })

    console.log('Base de données peuplée avec succès !')
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
