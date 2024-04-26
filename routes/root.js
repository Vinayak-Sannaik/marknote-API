const express = require('express')
const router = express.Router()
const path = require('path')

// 'router.get('^/$|/index(.html)?', ...): This defines a GET route that matches either the root URL ("/") or URLs containing "index" with an optional ".html" extension.


router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..','views', 'index.html'))
})

module.exports = router

