const plugins = require('./plugins')

let getBookDetail = async (isbn) => {
    let book
    let oUrl = plugins.getAPIUrl("openlibrary", { isbn: isbn })
    let oData = await plugins.getData(oUrl.url)
    // plugins.prettyPrint(oData)
    let oFound = Object.keys(oData).length > 0
    if (oFound) {
        let refData = oData["ISBN:" + isbn] // oData["urlInfo"] = oUrl
        refData["urlInfo"] = oUrl
        // plugins.prettyPrint(refData)
        book = plugins.structuredData("openlibrary", refData)
    } else {
        // try g book API
        let gUrl = plugins.getAPIUrl("googlebook", { isbn: isbn })
        let gData = await plugins.getData(gUrl.url)
        //plugins.prettyPrint(gData)
        if (gData.totalItems > 0) {
            let refData = gData["items"][0] // oData["urlInfo"] = oUrl
            refData["urlInfo"] = gUrl
            refData["bookISBN"] = isbn
            //plugins.prettyPrint(refData)
            book = plugins.structuredData("googlebook",refData)
        }
    }
    return book
}
module.exports.getBookDetail = getBookDetail
// getBookDetail("9788120305960").then(itm => {
//     plugins.prettyPrint(itm)
// })