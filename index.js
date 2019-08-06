var express = require("express");
var bodyParser = require("body-parser");
const fs = require("fs");
const port = process.env.PORT || 3000;
var app = express();
var items = "";

app.use(bodyParser.json());

app.get("/events", (req, res) => {
  var buffer = fs.readFileSync("db.json", "utf8");
  var data = buffer.toString("utf8");
  res.json(data);
});
app.get("/events/:id", (req, res) => {
  const elementId = parseInt(req.params.id);
  console.log(typeof elementId);
  var buffer = fs.readFileSync("db.json", "utf8");
  var data = buffer.toString("utf8");
  var object = JSON.parse(data);
  if (object !== "") {
    object.filter(item => {
      if (parseInt(item.id) === elementId) {
        items = item;
      }
    });
    if (items !== "") {
      res.status(200).json(items);
      items = "";
    } else {
      res.status(404).send("not found");
    }
  } else {
    res.status(204).send("no events");
  }
});

app.post("/events", (req, res) => {
  if (!fs.existsSync("db.json")) {
    fs.writeFileSync("db.json", JSON.stringify([]));
  }
  const buffer = fs.readFileSync("db.json", "utf8");
  const data = buffer.toString("utf8");
  const object = JSON.parse(data);
  console.log(req.body);
  const newData = req.body;
  const event = {
    id: `${new Date().getTime()}`,
    ...newData
  };
  object.push(event);
  fs.writeFileSync("db.json", JSON.stringify(object));
  console.log(event);
  res.status(201).send(event);
});
app.put("/events/:id", (req, res) => {
  var elementId = parseInt(req.params.id);
  if (!fs.existsSync("db.json")) {
    res.status(404).send("file not found");
  }
  var updatedData = req.body;
  //console.log(updatedData);
  const buffer = fs.readFileSync("db.json", "utf8");
  const data = buffer.toString("utf8");
  const object = JSON.parse(data);
  if (object !== "") {
    console.log(object);
    object.filter(item => {
      if (parseInt(item.id) === elementId) {
        var index = object.indexOf(item);
        items = object.splice(index, 1, {
          id: `${req.params.id}`,
          ...updatedData
        });
      }
    });
    if (items !== "") {
      fs.writeFileSync("db.json", JSON.stringify(object));
      items = "";
      res.status(202).json(object);
    } else {
      res.status(201).json(`no event with id= ${elementId}`);
    }
  } else {
    res.status(201).send("no contents");
  }
});
app.delete("/events/:id", (req, res) => {
  if (!fs.existsSync("db.json")) {
    res.status(404).send("file not found");
  }
  const elementId = parseInt(req.params.id);
  const buffer = fs.readFileSync("db.json", "utf8");
  const data = buffer.toString("utf8");
  const object = JSON.parse(data);
  object.map(item => {
    var index = object.indexOf(item);
    if (parseInt(item.id) === elementId) {
      items = object.splice(index, 1);
    }
  });
  if (items !== "") {
    fs.writeFileSync("db.json", JSON.stringify(object));
    items = "";
    res.status(201).send(object);
  } else {
    res.status(404).json(`no event with id ${elementId}`);
  }
});
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
