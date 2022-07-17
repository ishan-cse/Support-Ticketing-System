const express = require('express');
const database = require("./database");
const app = express();

app.use(express.json());

const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api', ticketRoutes);
app.use('/api', userRoutes);

app.listen(3000, () => {
    console.log(`Server Started at 3000`)
})
