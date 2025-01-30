import express from 'express';
import AnimeSeries from '../models/anime-series.js';
import mongoose from 'mongoose';

const router = express.Router();
const baseUrl = 'http://145.24.222.250:8001/animes';

// POST overloading for seeding
router.post('/', async (req, res) => {
    try {
        const { title, description, episodes } = req.body;

        // Validation of required fields
        if (!title || !description || !episodes) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Title, description, and episodes are required fields.'
            });
        }

        const newAnime = new AnimeSeries({ title, description, episodes });
        const savedAnime = await newAnime.save();

        // Set appropriate headers
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Location', `${baseUrl}/${savedAnime.id}`);

        // Return 201 Created with the new resource
        res.status(201).json(savedAnime);
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

router.get('/', async (req, res) => {
    try {

        const animes = await AnimeSeries.find({});

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.setHeader('Content-Type', 'application/json');
        res.json({
            items: animes,
            _links: {
                self: { href: baseUrl },
                collection: { href: baseUrl }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        res.setHeader('Content-Type', 'application/json');

        const anime = await AnimeSeries.findOne({ id: parseInt(req.params.id) });

        if (!anime) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Anime not found'
            });
        }

        res.json(anime);
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, description, episodes } = req.body;
        const updateData = {};

        // Only include fields that are provided and validate them
        if (title !== undefined) {
            if (title === null || title.trim() === '') {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Title cannot be empty'
                });
            }
            updateData.title = title.trim();
        }

        if (description !== undefined) {
            if (description === null || description.trim() === '') {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Description cannot be empty'
                });
            }
            updateData.description = description.trim();
        }

        if (episodes !== undefined) {
            if (episodes === null || episodes.trim() === '') {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Episodes cannot be empty'
                });
            }
            updateData.episodes = episodes.trim();
        }

        // If no fields were provided to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'No valid fields provided for update'
            });
        }

        const updatedAnime = await AnimeSeries.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedAnime) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Anime not found'
            });
        }

        res.json(updatedAnime);
    } catch (error) {   
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // Parse and validate the ID
        const animeId = parseInt(req.params.id);
        if (isNaN(animeId)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid ID format - must be a number'
            });
        }

        const deletedAnime = await AnimeSeries.findOneAndDelete({ id: animeId });

        if (deletedAnime) {
            return res.status(204).send();
        } else {
            return res.status(404).send();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.status(204).send();
});

export default router;