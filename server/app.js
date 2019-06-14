const express = require('express')
const app = express()
const port = 3000
const routes = require('./routers')
const mongoose = require('mongoose');
const dbName = "musicEvent"
const url = "mongodb://localhost:27017/"+dbName
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.listen(port, () => { console.log('Listening to port ', port) })

mongoose.connect(url, {useNewUrlParser: true}, (err) => {
  if(err) console.log('error connect mongoose')
  else console.log('connected to mongoose')
});

app.use('/api', routes)

app.use((err, req, res, next) => {
  let status = err.status || 500
	let message = err.message || 'Internal server error'
	res.status(status).json({
    message: message
	})
})
