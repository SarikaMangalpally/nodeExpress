var express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());
const {
  list,
  showEvent,
  postEvent,
  updateEvent,
  deleteEvent
} = require("./Event");

app.get("/events", list);
app.get("/events/:id", showEvent);
app.post("/events", postEvent);
app.put("/events/:id", updateEvent);
app.delete("/events/:id", deleteEvent);
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
