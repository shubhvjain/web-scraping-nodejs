const logger = require('morgan');
const express = require('express');
var bodyParser = require('body-parser')

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
app.get("/", (req, res) => {
  res.json({ "hello": 2323 })
})

let scrape = async(type,data) =>{
  try {
    let types = {
      'book':()=>{},
      'website':()=>{},
      'youtube':()=>{}
    }
    if(!types[type]){throw new Error("Item type to scrape not found")}
    return {}
  } catch (error) {
   throw error 
  }
}

app.post('/', async (req, res)=> {
  try {
    if(!req.body.type){throw new Error("Item not provided")}
    if(!req.body.data){throw new Error("Data not provided")}

    let type = req.body.type
    let data =  req.body.data
    let scrapedData = await scrape(type,data)
    res.json({type:type,data:scrapedData})

  } catch (error) {
    console.log("Error: "+error.message)
    res.json({ "error": error.message })
  }
});

const port = process.env.PORT || 3220

app.set('port', port)
app.use(logger('dev'))
app.listen(port, () => console.log(`App started on port ${port}.`))