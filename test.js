const book = require("./book")

book.getBookDetails(["9780141005942","9781408890257"]).then(data => {
    console.log(data)
}).catch(err=>{console.log(err)})