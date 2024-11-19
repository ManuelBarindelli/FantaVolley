const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Middleware per gestire JSON e form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connessione al database SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Errore nella connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite.');

    // Creazione della tabella punteggi
    db.run(`
      CREATE TABLE IF NOT EXISTS punteggi (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        squadra1 TEXT NOT NULL,
        punteggio1 INTEGER NOT NULL,
        squadra2 TEXT NOT NULL,
        punteggio2 INTEGER NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Errore durante la creazione della tabella:', err.message);
      } else {
        console.log('Tabella "punteggi" pronta.');
      }
    });
  }
});

// Endpoint per inserire punteggi
app.post('/inserisci-punteggio', (req, res) => {
  const { squadra1, punteggio1, squadra2, punteggio2 } = req.body;

  const query = `
    INSERT INTO punteggi (squadra1, punteggio1, squadra2, punteggio2)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [squadra1, punteggio1, squadra2, punteggio2], function (err) {
    if (err) {
      console.error('Errore durante l\'inserimento:', err.message);
      res.status(500).json({ error: 'Errore durante l\'inserimento' });
    } else {
      res.status(200).json({ success: 'Punteggio inserito con successo', id: this.lastID });
    }
  });
});

// Endpoint per ottenere tutti i punteggi
app.get('/punteggi', (req, res) => {
  const query = `SELECT * FROM punteggi`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Errore durante il recupero dei dati:', err.message);
      res.status(500).json({ error: 'Errore durante il recupero dei dati' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
