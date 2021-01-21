const https = require('https');

let currentDate = () => {
    let d = new Date();
    let day = d.getDate() > 9 ? d.getDate() : ("0" + d.getDate());
    let month = (d.getMonth() + 1 > 9 ? (d.getMonth() + 1) : ("0" + (d.getMonth() + 1)))
    let year = d.getFullYear()
    let hour = d.getHours() > 9 ? d.getHours() : ("0" + d.getHours());
    let minute = d.getMinutes() > 9 ? d.getMinutes() : ("0" + d.getMinutes());
    let str = year + "-" + month + "-" + day + "T" + hour + ":" + minute
    return str
}
module.exports.currentDate = currentDate


let getData = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let body = "";
            res.on("data", (chunk) => { body += chunk; });
            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    resolve(json)
                } catch (error) { reject(error) }
            });
        }).on("error", (error) => { reject(error) });
    })
}
module.exports.getData = getData

let getAPIUrl = (apiType, data) => {
    let apis = {
        "youtube": () => {
            return {
                url: `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=${data.videoId}&key=${process.env.GOOGLE_APP_API}`,
                short: `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=${data.videoId}`
            }
        }
    }
    let url = apis[apiType]()
    return url
}
module.exports.getAPIUrl = getAPIUrl


let structuredData = (apiType, data) => {
    // console.log(data)
    // let url = getAPIUrl(apiType)
    let apis = {
        "youtube": () => {
            let date = currentDate()
            let newRec = {
                id: data.id,
                category: "Video",
                date: date,
                tags: [],
                link: "",
                title: "",
                note: ""
            }
            newRec["link"] = `https://www.youtube.com/watch?v=${data.id}`
            newRec["sub_category"] = "Youtube"
            newRec["preview"] = false
            newRec["title"] = data.snippet["title"]
            newRec["tags"] = data.snippet["tags"] ? data.snippet["tags"] : []
            newRec["cover_image"] = data.snippet["thumbnails"]["default"]["url"]
            newRec["note"] = `Data fetched from [Youtube API](${data["urlInfo"]["short"]}) on ${date}. 
Channel : [${data.snippet["channelTitle"]}](https://www.youtube.com/channel/${data.snippet["channelId"]})`
            return newRec
        }
    }
    let sData = apis[apiType]()
    return sData
}
module.exports.structuredData = structuredData