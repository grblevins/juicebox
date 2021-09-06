const express = require('express');
const tagsRouter = express.Router();

const { getAlltags} = require('../db');

tagsRouter.get('/', async (req, res) => {
    const tags = await getAlltags();

    res.send({
        tags
    });
});

tagsRouter.get('/', (req, res) => {
    res.send({
        tags: []
    });
});

module.exports = tagsRouter;