const express = require('express');
const tagsRouter = express.Router();

const { getAllTags} = require('../db');

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

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