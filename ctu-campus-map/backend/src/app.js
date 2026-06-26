const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

app.get('/', (req, res) => {
    return res.send('Hello World');
});
app.post('/sum', (req, res) => {
    const { a, b } = req.body;
    res.json({ result: a + b });
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
