const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

// medju-portna konekcija
const cors = require('cors');
const {sequelize} = require('./models');

const {userSchema} = require('./validation_schema');

var corsOptions = {
    origin: 'http://127.0.0.1:8000',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.use('/admin', adminRoutes);

app.listen({ port: 9000 }, async () => {
    await sequelize.authenticate();
});