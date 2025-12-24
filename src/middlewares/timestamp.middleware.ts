import {NextFunction, Request, Response} from 'express'
import {app} from "@/index";

app.use((req: Request, _res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] Requête reçue : ${req.method} ${req.url}`)
    next() // Passe à la prochaine fonction middleware ou route
})
