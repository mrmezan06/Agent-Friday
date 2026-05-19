const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/info', async (req, res) => {
  try {
    const info = await systemController.getSystemInfo();
    if (!info) {
      return res.status(500).json({ error: 'Failed to get system info' });
    }
    res.json({ success: true, system: info });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system info' });
  }
});

module.exports = router;