var express = require('express');
var router = express.Router();

// const {createUser, login} = require("./controller/userController");
const {createUser, login} = require("./controller/userController");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(login)
});

router.post("/create-user", createUser);
router.post("/login", login);

module.exports = router;
