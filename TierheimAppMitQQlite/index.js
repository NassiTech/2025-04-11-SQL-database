const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`CREATE TABLE tiere (
     id INTEGER PRIMARY KEY,
     tierart VARCHAR(50),
     name VARCHAR(50),
     krankheit VARCHAR(100),
     age INT,
     gewicht REAL);`);
  db.run(
    `INSERT INTO tiere(tierart,name,krankheit,age,gewicht) VALUES ("Maus","Pip","krebs",4,0.4)`
  );

  selectAllTiereQuery = `SELECT * FROM tiere`;
  db.all(selectAllTiereQuery, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
    }
  });
  process.on("exit", () => {
    db.close();
  });
});

app.use(express.json()); // ermöglicht mepress json aus einem body auszulesen
app.get("/", (req, res) => {
  res.send("Die API funktioniert!");
});

app.get("/tiere", (req, res) => {
  db.all(selectAllTiereQuery, (err, rows) => {
    if (err) {
      res.status(404).send("Fehler in deiner Query Anfrage");
    } else {
      res.json(rows);
    }
  });
});

app.post("/tiere", (req, res) => {
  const { tierart, name, krankheit, age, gewicht } = req.body;
  db.run(
    `INSERT INTO tiere (tierart,name,krankheit,age,gewicht) 
        VALUES(?,?,?,?,?)`,
    [tierart, name, krankheit, age, gewicht]
  );
  res.status(201).send("Tier wurde erfolgreich hinzugefügt");
});

app.get("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const selectTiereByQuery = "SELECT * FROM  tiere  WHERE id = ?";
  db.get(selectTiereByQuery, [id], (err, rows) => {
    if (err) {
      res.status(404).send("Fehler in deiner Query Anfrage");
    } else {
      res.json(rows);
    }
  });
});
// better than the command row 47
app.post("/createNewTier", (req, res) => {
  const { tierart, name, krankheit, age, gewicht } = req.body;
  db.run(
    `INSERT INTO tiere (tierart,name,krankheit,age,gewicht) 
        VALUES(?,?,?,?,?)`,
    [tierart, name, krankheit, age, gewicht],
    (err, rows) => {
      if (err) {
        res.status(404).send("Fehler in deiner Query Anfrage");
      } else {
        res.json(rows);
      }
    }
  );
  res.status(201).send("Tier wurde erfolgreich hinzugefügt");
});

app.put("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const { tierart, name, krankheit, age, gewicht } = req.body;
  db.run(
    `UPDATE tiere
SET tierart = ?, name = ?, krankheit = ?, age = ?, gewicht = ?
WHERE id = ?`,

    [tierart, name, krankheit, age, gewicht, id],
    (err, rows) => {
      if (err) {
        res.status(404).send("Fehler in deiner Query Anfrage");
      } else {
        res.status(201).send("Tier wurde erfolgreich hinzugefügt");
      }
    }
  );
});

app.delete("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const selectTiereByQuery = "DELETE  FROM  tiere  WHERE id = ?";
  db.run(selectTiereByQuery, [id], (err, rows) => {
    if (err) {
      res.status(404).send("Fehler in deiner Query Anfrage");
    } else {
      res.json(rows);
    }
  });

  res.status(201).send("Tier wurde erfolgreich gelöscht");
});

app.listen(3000);
