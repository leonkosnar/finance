const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/account', auth, async (req, res) => {
    try {
        const jwt = req.bank_jwt;
        const response = await fetch('http://localhost:3001/account', {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            console.log(response.status, response);
            throw new Error('Bank service failed');
        };

        const bankData = await response.json();

        // You might filter based on user identity (req.user.id) here
        res.json(bankData);

    } catch (err) {
        console.dir(err, { depth: null })
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;