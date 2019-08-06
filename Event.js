const fs = require("fs");
var moment = require("moment");
var items = "";

function list(req, res) {
  var buffer = fs.readFileSync("db.json", "utf8");
  var data = buffer.toString("utf8");
  res.status(200).json(JSON.parse(data));
}
function showEvent(req, res) {
  const elementId = parseInt(req.params.id);
  //console.log(typeof elementId);
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
      res.status(404).json({ error: "not found" });
    }
  } else {
    res.status(204).json({ error: "no events" });
  }
}

function postEvent(req, res) {
  if (!fs.existsSync("db.json")) {
    fs.writeFileSync("db.json", JSON.stringify([]));
  }
  const buffer = fs.readFileSync("db.json", "utf8");
  const data = buffer.toString("utf8");
  const object = JSON.parse(data);
  // console.log(req.body);
  const newData = req.body;
  var value = checkValidity(newData);
  if (value === true) {
    const event = {
      id: `${new Date().getTime()}`,
      ...newData
    };
    object.push(event);
    fs.writeFileSync("db.json", JSON.stringify(object));
    // console.log(event);
    res.status(201).json(event);
  } else {
    res.status(400).json({ error: `${value}` });
  }
}
function checkValidity(newData) {
  if (
    moment(newData.startday, "LL", true).format() === "Invalid date" ||
    moment(newData.endday, "LL", true).format() === "Invalid date"
  ) {
    return `format should be example:"december 12, 1997"`;
  } else if (
    moment(newData.starttime, "LT", true).format() === "Invalid date" ||
    moment(newData.endtime, "LT", true).format() === "Invalid date"
  ) {
    return `format should be example:"4:45 pm/PM"`;
  }
  var sd = moment(newData.startday, "LL", true);
  var ed = moment(newData.endday, "LL", true);
  var st = moment(newData.starttime, "LT", true);
  var et = moment(newData.endtime, "LT", true);
  if (moment(sd).isSame(ed)) {
    if (moment(et).isSameOrBefore(st)) {
      return "event can't end on same day, at same time/before time";
    }
  } else {
    if (moment(ed).isBefore(sd)) {
      return "event end day can't be before event start day";
    }
  }
  return true;
}
function updateEvent(req, res) {
  var elementId = parseInt(req.params.id);
  var updatedData = req.body;
  //console.log(updatedData);
  if (!fs.existsSync("db.json")) {
    res.status(404).json({ error: "file not found" });
  }
  const buffer = fs.readFileSync("db.json", "utf8");
  const data = buffer.toString("utf8");
  const object = JSON.parse(data);
  if (object !== "") {
    //console.log(object);
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
      res.status(201).json({ error: `no event with id= ${elementId}` });
    }
  } else {
    res.status(201).json({ error: "no contents" });
  }
}

function deleteEvent(req, res) {
  const elementId = parseInt(req.params.id);
  if (!fs.existsSync("db.json")) {
    res.status(404).json({ error: "file not found" });
  }
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
    res.status(201).json(object);
  } else {
    res.status(404).json({ error: `no event with id ${elementId}` });
  }
}

module.exports = { list, showEvent, postEvent, updateEvent, deleteEvent };
