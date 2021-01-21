const plugins = require("./plugins")

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
    return searchResults
}
module.exports.getYoutubeMetaData = getYoutubeMetaData