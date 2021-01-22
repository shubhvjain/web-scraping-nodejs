const logger = require('morgan');
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET")
    return res.status(200).json({});
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
    if(!types[type]){throw new Error("Item not found")}
    
  } catch (error) {
   throw error 
  }
}

app.post('/', (req, res)=> {
  try {
    
  } catch (error) {
    res.json({ "error": error.message }); 
  }
});

const port = process.env.PORT || 3220;

app.set('port', port);
app.use(logger('dev'));
app.listen(port, () => console.log(`App started on port ${port}.`));