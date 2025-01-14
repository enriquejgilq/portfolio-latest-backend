import cors from 'cors'
import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import portfolioRoutes from './src/routes/portfolio.routes.js'
import { handleUndefinedRoutes } from './src/middleware/validator.middleware.js'

const app = express()
app.use(cookieParser())
if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Authorization', 'Content-type', 'company-path'],
        exposedHeaders: ['Authorization'],
    }));
} else {
    app.use(cors({ origin: process.env.CORS_ORIGIN_DEV, credentials: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', }))
}

app.use(morgan("dev"));
app.use(express.json())
app.use('/api', portfolioRoutes)
app.use(handleUndefinedRoutes);


export default app;
