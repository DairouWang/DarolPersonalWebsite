const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all comments
router.get('/comments', async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch comments' });
    }
});

// Add a new comment
router.post('/comments', async (req, res) => {
    const { name, content } = req.body;

    if (!name || !content) {
        return res.status(400).json({ error: 'Name and content are required' });
    }

    try {
        const newComment = await prisma.comment.create({
            data: { name, content },
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create comment' });
    }
});

// Update a comment
router.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
        return res.status(400).json({ error: 'Name and content are required' });
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(id) },
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.name !== name) {
            return res.status(403).json({ error: 'You can only edit your own comments' });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { content },
        });
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update comment' });
    }
});

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.comment.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete comment' });
    }
});

module.exports = router;