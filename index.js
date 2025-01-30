import express from 'express';
import mongoose from 'mongoose';
import animeRoutes from './routes/anime_route.js';


const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/anime-express-backend');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res,next) => {
    const acceptHeader = req.headers.accept || '';
    if (!acceptHeader.includes('application/json') && acceptHeader !== '*/*') {
        return res.status(406).json({ 
            error: 'Not Acceptable'
        });
    }
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to Anime API');
});

app.use('/animes', animeRoutes);

app.listen(process.env.EXPRESS_PORT || 8001, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT || 8001}`);
});