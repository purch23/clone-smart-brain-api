const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const Clarifai = require('clarifai');

const ClarifaiApp = new Clarifai.App({
  apiKey: process.env.API_KEY
});
const PORT = process.env.PORT || 3000;
const db_user = process.env.DB_USER || 'postgres'
const db_password = process.env.DB_PASSWORD || ''

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: '5432',
    user: db_user,
    password: db_password,
    database: 'smart-brain'
  }
});
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(db);
});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res, ClarifaiApp) });

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
})
