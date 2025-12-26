import {PrismaBetterSqlite3} from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcrypt'
import {PrismaClient} from "@/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({adapter})

/**
 * Fonction principale de seed de la base de données
 *
 * Cette fonction :
 * 1. Supprime tous les utilisateurs existants
 * 2. Réinitialise la séquence d'auto-incrémentation SQLite
 * 3. Crée 3 utilisateurs de test (Alice, Bob, John Doe)
 * 4. Tous les utilisateurs utilisent le mot de passe "password123" (haché avec bcrypt)
 *
 * @async
 * @throws {Error} Si une erreur survient pendant le seeding
 */
async function main() {
    await prisma.user.deleteMany()
    await prisma.$executeRaw`DELETE
                             FROM sqlite_sequence
                             WHERE name = 'User'`

    // Tous les utilisateurs auront le mot de passe "password123"
    const hashedPassword = await bcrypt.hash('password123', 10)

    await prisma.user.createMany({
        data: [
            {
                name: 'Alice',
                email: 'alice@example.com',
                password: hashedPassword,
            },
            {
                name: 'Bob',
                email: 'bob@example.com',
                password: hashedPassword,
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
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