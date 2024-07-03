const express = require('express');
const { router } = require('./modules/proxy/routes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.ip} ${req.method} ${req.url}`);
    next();
});

app.use('/proxy', router);
app.use((req, res) => {
    res.status(404).send({ message: 'Route Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
