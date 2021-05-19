
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const express = require('express')
const imageResizeController = require('./src/controllers/imageResizeController')
const app = express()
app.post('/api/v1/', imageResizeController.store)
exports.app = functions.https.onRequest(app)
