const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const routes = require('./router');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
 }));

app.use('/api',routes);

/*
app.post('/api/user/create-recipe', upload.single('recipeImage'), (req, res,next) => {
  console.log(req.file)

  /*var file;

  if(!req.files)
  {
      console.log("File was not found");
      return;
  }
  console.log(req.files);
  file = req.files.FormFieldName;  // here is the field name of the form

 

}); */


 var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Running RestHub on port " + port);
});
module.exports = app;


function newFunction(req) {
  console.log(req.body);
}
  /*
accountrole = require('./models').AccountRole;

async function myF() {
  let x = await accountrole.findAll({
    where: {
      role: 'x'
    },
    limit: 1
  });
  if(x[0])
    console.log('vardir..');

}
myF(); */