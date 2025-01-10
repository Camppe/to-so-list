const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_db'
});

app.get('/card', (req, res) => {
    db.query('SELECT * FROM card', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
})

app.post('/card', (req, res) => {
    const { name, description, status } = req.body;
    db.query('INSERT INTO card (name, description, status) VALUES (?, ?,?)', [name, description, status], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Values Inserted');
        }
    });
})

app.put('/card/:id', (req, res) => {
    const { name, description, status } = req.body;
    const id = req.params.id;
    db.query('UPDATE card SET name = ?, description = ?, status = ? WHERE id = ?', [name, description, status, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Values Updated');
        }
    });
})

app.delete('/card/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM card WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Values Deleted');
        }
    });
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
