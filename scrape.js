const plugins = require('./plugins')
var rp = require('request-promise');
const cheerio = require('cheerio');

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
            book = plugins.structuredData("googlebook", refData)
        }
    }
    return book
}
module.exports.getBookDetail = getBookDetail

let getYoutubeMetaData = async (videoId) => {
    let searchResults = {}
    if (!videoId) { throw new Error("Invalid ID") }
    let u = plugins.getAPIUrl("youtube", { videoId: videoId })
    let vidData = await plugins.getData(u.url)
    if (vidData.items.length > 0) {
        let vidData1 = vidData.items[0]
        vidData1["urlInfo"] = u
        let strData = plugins.structuredData("youtube", vidData1)
        searchResults = strData // .found.push(strData)
    }
    plugins.prettyPrint(searchResults)
    return searchResults
}
module.exports.getYoutubeMetaData = getYoutubeMetaData

let getWebsiteMetaData = (url) => {
    return new Promise((resolve, reject) => {
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        rp(options)
            .then($ => {
                let metaData = {
                    title: $('h1').text(),
                    canonical: $('link[rel="canonical"]').attr('href'),
                    description: $('meta[name="description"]').attr('content'),
                    // Open-Graph values
                    og_title: $('meta[property="og:title"]').attr('content'),
                    og_url: $('meta[property="og:url"]').attr('content'),
                    og_img: $('meta[property="og:image"]').attr('content'),
                    og_type: $('meta[property="og:type"]').attr('content'),

                    // Twitter Values
                    twitter_site: $('meta[name="twitter:site"]').attr('content'),
                    twitter_domain: $('meta[name="twitter:domain"]').attr('content'),
                    twitter_img_src: $('meta[name="twitter:image:src"]').attr('content'),
                }
                resolve(metaData)
            })
            .catch(error => {
                reject(error)
            })
    })
}
module.exports.getWebsiteMetaData = getWebsiteMetaData

let get = async (type, data) => {
    try {
        let types = {
            'book':async ()=>{
                let book1 = await getBookDetail(data.id)
                return book1
            },
            'website':async()=>{
                let webData = await getWebsiteMetaData(data.id)
                return webData
            },
            'youtube':async()=>{
                let ytData = await getYoutubeMetaData(data.id)
                return ytData
            }
          }
          if(!types[type]){throw new Error("Item type to scrape not found")}
          let data1 = await types[type]()
          // console.log(data1)
          return data1
    } catch (error) {
        throw error
    }
}
module.exports.get = get