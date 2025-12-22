import {PrismaBetterSqlite3} from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcrypt'
import {PrismaClient} from "@/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({adapter})

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