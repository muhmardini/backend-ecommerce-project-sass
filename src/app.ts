import { timeStamp } from 'console';
import express, { NextFunction } from 'express'
import { success } from 'zod';

export const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timeStamp: new Date().toISOString()
    })
})




app.use((_req,res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

// global error handler

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({
        success: false,
        message: 'Internal Server error',
    })
})