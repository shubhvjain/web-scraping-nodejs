const book = require("./book")
const website = require("./website")
// book.getBookDetails(["9780349121086","9788120305960"]).then(data => {
//     console.log(JSON.stringify(data,null,2))
// }).catch(err=>{console.log(err)})

website.getMetaData("https://css-tricks.com/essential-meta-tags-social-media/").then(data => {
    console.log(JSON.stringify(data,null,2))
//     console.log(JSON.stringify(data,null,2))
 }).catch(err=>{console.log(err)})