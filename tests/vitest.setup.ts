import {DeepMockProxy, mockDeep, mockReset} from 'vitest-mock-extended'
import {beforeEach, vi} from 'vitest'
// Import du client mocké
import prisma from '../src/client'
import {PrismaClient} from "@/generated/prisma/client";

// Mock du module Prisma
vi.mock('../src/client', () => ({
    default: mockDeep<PrismaClient>(),
}))

// Mock du middleware d'authentification
vi.mock('../src/auth/auth.middleware', () => ({
    authenticateToken: vi.fn((req, res, next) => {
        // Simule un utilisateur authentifié
        req.userId = 1
        next()
    }),
}))

// Reset des mocks avant chaque test
beforeEach(() => {
    mockReset(prismaMock)
})

// Export du mock typé
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
