const book = require("./book")

book.getBookDetails(["9780349121086","9788120305960"]).then(data => {
    console.log(JSON.stringify(data,null,2))
}).catch(err=>{console.log(err)})
