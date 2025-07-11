const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET /spaces?account_id=...
 */
router.get('/spaces', auth, (req, res) => {
    const accountId = req.user;
    if (!accountId) return res.status(400).json({ error: 'account_id is required' });

    const spaces = db.prepare('SELECT * FROM spaces WHERE account_id = ?').all(accountId);
    if (!spaces) return res.status(500).send();
    res.json(spaces);
});
router.get('/space/:id', auth, (req, res) => {
    const spaceId = req.params.id;
    if (!spaceId) return res.status(400).json({ error: 'id is required' });

    const spaces = db.prepare('SELECT * FROM spaces WHERE id = ?').get(spaceId);
    if (!spaces) return res.status(500).send();
    res.json(spaces);
});

/**
 * POST /spaces
 * Body: { account_id, name, color, balance, goal_balance, is_default }
 */
router.post('/spaces', auth, (req, res) => {
    const account_id = req.user;
    const { name, color, goal_balance = 0 } = req.body;

    if (!account_id || !name) {
        return res.status(400).json({ error: 'account_id and name are required' });
    }

    const sql = `INSERT INTO spaces (account_id, name, color, balance, goal_balance, is_default)
                 VALUES (?, ?, ?, 0, ?, 0)`;

    db.prepare(sql).run(account_id, name, color, goal_balance);
    res.status(201).send();
});

/**
 * DELETE /spaces/:id
 * Only if is_default = false
 */
router.delete('/spaces/:id', auth, (req, res) => {
    const spaceId = req.params.id;
    try {
        const row = db.prepare('SELECT is_default FROM spaces WHERE id = ?').get(spaceId);

        if (!row) {
            return res.status(404).json({ error: 'Space not found' });
        }

        if (row.is_default) {
            return res.status(403).json({ error: 'Cannot delete default space' });
        }

        db.prepare('DELETE FROM spaces WHERE id = ?').run(spaceId);
        res.status(200).send();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /rules?space_id=...
 */
router.get('/rules', auth, (req, res) => {
    const spaceId = req.query.space_id;
    if (!spaceId) return res.status(400).json({ error: 'space_id is required' });

    const rules = db.prepare('SELECT * FROM rules WHERE space_id = ?').all(spaceId);
    const spaces = db.prepare('SELECT id, name FROM spaces WHERE account_id = ?').all(req.user);
    if (!rules) return res.status(500).send();
    res.json({ rules: rules, spaces: spaces });
});

/**
 * POST /rules
 * Body: { tag, percentage, space_id }
 */
router.post('/rule', auth, (req, res) => {
    const { tag, percentage, space_id } = req.body;
    console.log(tag, percentage, space_id)

    if (!tag || !percentage || !space_id) {
        console.debug("body incomplete")
        return res.status(400).json({ error: 'tag, percentage and space_id are required' });
    }

    try {
        const sql = db.prepare(`INSERT INTO rules (tag, percentage, space_id) VALUES (?, ?, ?)`).run(tag, percentage, space_id);
        console.debug(sql)

        if (!sql) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    }
    catch (e) {
        console.debug(e)
        res.status(500).json({ message: e });
    }
});

/**
 * DELETE /rules/:id
 */
router.delete('/rule/:id', auth, (req, res) => {
    const ruleId = req.params.id;
    console.debug(`DELETE rule ${ruleId}`)
    db.prepare('DELETE FROM rules WHERE id = ?').run(ruleId)
    res.json({ success: true });
});

router.post('/move', auth, (req, res) => {
    const { src, dst, amt } = req.body;
    try {
        const updateBalances = db.transaction(() => {
            const from = db.prepare('UPDATE spaces SET balance = balance - ? WHERE id = ?').run(amt, src);
            const to = db.prepare('UPDATE spaces SET balance = balance + ? WHERE id = ?').run(amt, dst);
        });

        const result = updateBalances()

        console.debug(result)
        return res.status(200).send()
    }
    catch (e){
        console.error(e)
        res.status(500).send()
    }
})

module.exports = router;