const express = require('express');
const { handleTextRequest } = require('../lib/text/handler');

const router = express.Router();

router.get('/', (req, res) => {
  const result = handleTextRequest(req.query);
  res.status(result.status).json(result.body);
});

module.exports = router;
