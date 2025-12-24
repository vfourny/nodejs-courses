import {PrismaBetterSqlite3} from '@prisma/adapter-better-sqlite3'
import {PrismaClient} from "@/generated/prisma/client";

/**
 * Adaptateur SQLite pour Prisma
 * Utilise better-sqlite3 pour des performances optimales avec SQLite
 */
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db',
})

/**
 * Instance du client Prisma configurée avec l'adaptateur SQLite
 *
 * Cette instance est utilisée dans toute l'application pour interagir avec la base de données.
 * Elle utilise better-sqlite3 comme adaptateur pour de meilleures performances.
 *
 * @type {PrismaClient}
 */
const prisma = new PrismaClient({adapter})

export default prisma