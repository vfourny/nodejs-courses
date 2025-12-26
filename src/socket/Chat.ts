import {Server as HTTPServer} from 'http'
import {Server, Socket} from 'socket.io'
import jwt from 'jsonwebtoken'

// Types simplifiés pour les événements avec rooms
interface ClientToServerEvents {
    user: (username: string) => void
    message: (username: string, message: string) => void
    'join-room': (room: string) => void
    'leave-room': (room: string) => void
    'room-message': (room: string, message: string) => void
}

interface ServerToClientEvents {
    welcome: (message: string) => void
    'user-joined': (message: string) => void
    message: (data: { username: string, message: string }) => void
    'room-joined': (data: { room: string, users: string[] }) => void
    'room-user-joined': (username: string) => void
    'room-user-left': (username: string) => void
    'room-message': (data: { username: string, message: string }) => void
}

// Données stockées après authentification (correspond au JWT du cours 11)
interface UserData {
    userId: number
    email: string
}

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>

export class ChatServer {
    private io: TypedServer
    private rooms: Map<string, Set<string>> // roomName -> Set of socketIds

    constructor(httpServer: HTTPServer) {
        this.io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
            cors: {origin: '*'},
        })

        // Initialiser les rooms par défaut
        this.rooms = new Map([
            ['general', new Set()],
            ['nodejs', new Set()],
        ])

        this.setupAuthMiddleware()
        this.initializeSocket()
    }

    // Middleware d'authentification (même que le cours précédent)
    private setupAuthMiddleware() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token

            if (!token) {
                return next(new Error('Token manquant'))
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserData
                socket.data = decoded
                next()
            } catch (error) {
                next(new Error('Token invalide ou expiré'))
            }
        })
    }

    private initializeSocket() {
        this.io.on('connection', (socket) => {
            const userData = socket.data as UserData
            console.log('Nouvelle connexion:', socket.id, `(${userData.email})`)

            socket.emit('welcome', `Bienvenue ${userData.email}!`)

            socket.on('user', (username) => this.handleUser(socket, userData))
            socket.on('message', (username, message) => this.handleMessage(socket, userData, message))
            socket.on('join-room', (room) => this.handleJoinRoom(socket, userData, room))
            socket.on('leave-room', (room) => this.handleLeaveRoom(socket, userData, room))
            socket.on('room-message', (room, message) => this.handleRoomMessage(socket, userData, room, message))
            socket.on('disconnect', () => this.handleDisconnect(socket, userData))
        })
    }

    private handleUser(socket: TypedSocket, userData: UserData) {
        console.log('Utilisateur connecté:', userData.email)
        socket.broadcast.emit('user-joined', `${userData.email} s'est connecté`)
    }

    private handleMessage(socket: TypedSocket, userData: UserData, message: string) {
        console.log(`${userData.email}: ${message}`)
        this.io.emit('message', {username: userData.email, message})
    }

    private handleJoinRoom(socket: TypedSocket, userData: UserData, room: string) {
        if (!this.rooms.has(room)) {
            return socket.emit('error', "Cette room n'existe pas")
        }

        socket.join(room)
        this.rooms.get(room)!.add(socket.id)

        const users = this.getRoomUsers(room)
        socket.emit('room-joined', {room, users})
        socket.to(room).emit('room-user-joined', userData.email)

        console.log(`${userData.email} a rejoint la room ${room}`)
    }

    private handleLeaveRoom(socket: TypedSocket, userData: UserData, room: string) {
        const roomSet = this.rooms.get(room)
        if (roomSet && roomSet.has(socket.id)) {
            roomSet.delete(socket.id)
            socket.leave(room)
            socket.to(room).emit('room-user-left', userData.email)
            console.log(`${userData.email} a quitté la room ${room}`)
        }
    }

    private handleRoomMessage(socket: TypedSocket, userData: UserData, room: string, message: string) {
        const roomSet = this.rooms.get(room)
        if (roomSet && roomSet.has(socket.id)) {
            this.io.to(room).emit('room-message', {username: userData.email, message})
        }
    }

    private handleDisconnect(socket: TypedSocket, userData: UserData) {
        this.rooms.forEach((roomSet, roomName) => {
            if (roomSet.has(socket.id)) {
                roomSet.delete(socket.id)
                socket.to(roomName).emit('room-user-left', userData.email)
            }
        })
    }

    private getRoomUsers(room: string): string[] {
        const roomSet = this.rooms.get(room)
        if (!roomSet) return []

        const users: string[] = []
        roomSet.forEach(socketId => {
            const socket = this.io.sockets.sockets.get(socketId)
            if (socket) {
                users.push((socket.data as UserData).email)
            }
        })
        return users
    }
}
