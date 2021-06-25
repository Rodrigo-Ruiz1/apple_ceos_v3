'use strict';

const express = require('express');
const router = express.Router();
const ExecutiveModel = require('../models/ExecutivesModel');
const slugify = require('slugify');

router.get('/:slug?', async (req, res,) => {
    if (!!req.params.slug) {
        const { slug } = req.params;
        const theCEO = await ExecutiveModel.getBySlug(slug);
        console.log(theCEO);

        res.render('template', {
            locals: {
                title: 'Ceo Details',
                ceo: theCEO
            },
            partials: {
                body: 'partials/ceo-details'
            },
        });
    } else {
        const ExecutiveData = await ExecutiveModel.getAll();
        res.render('template', {
            locals: {
                title: 'Home Page',
                data: ExecutiveData
            },
            partials: {
                body: 'partials/home'
            },
        });
    }
});

router.post('/', async (req, res) => {
    console.log("The Request Body is: ", req.body);
    const { ceo_name, ceo_year } = req.body;

    const slug = slugify(ceo_name, {
        replacement: '_',
        lower: true,
        strict: true
    });

    const newExecutive = new ExecutiveModel(null, ceo_name, slug, ceo_year);

    const response = await newExecutive.addEntry();
    console.log("POST ROUTE RESPONSE: ", response);
    res.sendStatus(200);
});

router.post('/delete', async (req, res) => {
    const { id, ceo_name, slug, ceo_year } = req.body;

    const executiveToDelete = new ExecutiveModel(id, ceo_name, slug, ceo_year);
    const response = await executiveToDelete.deleteEntry();
    console.log("DELETE ROUTE RESPONSE IS: ", response);
    res.sendStatus(200);
})

module.exports = router;