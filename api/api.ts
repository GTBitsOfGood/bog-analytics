import express from 'express';

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello, TypeScript API!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
