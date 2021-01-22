const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser')
const scrape = require("./scrape")
const app = express();
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET")
    return res.status(200).json({})
  }
  next();
})
app.get("/", (req, res) => {res.json({ "hello": "Hello world" })})

app.post('/', async (req, res)=> {
  try {
    if(!req.body.type){throw new Error("Item not provided")}
    if(!req.body.data){throw new Error("Data not provided")}

    let type = req.body.type
    let data =  req.body.data
    // console.log(data)
    let scrapedData = await scrape.get(type,data)
    res.json({type:type,data:scrapedData})

  } catch (error) {
    console.log(error)
    console.log("Error: "+error.message)
    res.json({ "error": error.message })
  }
});

const port = process.env.PORT || 3220

app.set('port', port)
app.use(logger('dev'))
app.listen(port, () => console.log(`App started on port ${port}.`))