const express = require("express");
const port = 3000;
const app = express();
const connection = require("./config");
const bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.get("/", (request, response) => {
  console.log(request);
  response.send("Welcome to Monsters");
});

app.get("/monsters", (req, res) => {
  connection.query("SELECT * from monsters", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/monsters/:something", (req, res) => {
  connection.query(
    `SELECT ${req.params.something} from monsters`,
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});
app.get("/monsters/filters/startwith/:something", (req, res) => {
  connection.query(
    `SELECT * from monsters WHERE monsters.name LIKE '${req.params.something}%'`,
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});
app.get("/monsters/filters/contains/:something", (req, res) => {
  connection.query(
    `SELECT * from monsters WHERE monsters.name LIKE '%${req.params.something}%'`,
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});
app.get("/monsters/filters/greaterthan/:something", (req, res) => {
  connection.query(
    `SELECT * from monsters WHERE date_added > '${req.params.something}'`,
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});
app.get("/monsters/filters/greaterthan/:something", (req, res) => {
  connection.query(
    `SELECT * from monsters WHERE date_added > '${req.params.something}'`,
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/monsters/order/:ascdesc", (req, res) => {
  connection.query(
    `SELECT * from monsters order by name ${req.params.ascdesc}`,
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.post("/monsters/add", (req, res) => {
  console.log(req.body);
  const { name, date_added, evil } = req.body;
  connection.query(
    "INSERT INTO monsters (name, date_added, evil) VALUES(?, ? , ?)",
    [name, date_added, evil],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error");
      } else {
        res.status(200).send("Successfully added");
      }
    }
  );
});

app.put("/monsters/edit/:id", (req, res) => {
  const idUser = req.params.id;
  const newUser = req.body;
  connection.query(
    "UPDATE monsters SET ? WHERE id = ?",
    [newUser, idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error ");
      } else {
        res.status(200).send("Entry updated successfully ");
      }
    }
  );
});
app.put("/monsters/toggle/:id", (req, res) => {
  const idUser = req.params.id;
  connection.query(
    "UPDATE monsters SET evil = NOT evil WHERE id = ?",
    [idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error ");
      } else {
        res.status(200).send("Toggled ");
      }
    }
  );
});

app.delete("/monsters/delete/:id", (req, res) => {
  const idUser = req.params.id;

  connection.query(
    "DELETE FROM monsters WHERE id = ?",
    [idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting a monster");
      } else {
        res.status(200).send("🎉 Monster deleted!");
      }
    }
  );
});
app.delete("/monsters/delete-evil", (req, res) => {
  const idUser = req.params.id;

  connection.query(
    "DELETE FROM monsters WHERE evil = 1",
    [idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error ");
      } else {
        res.status(200).send(" Evil Be gone");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
