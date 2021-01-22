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
        },
        "openlibrary": () => {
            let url = `https://openlibrary.org/api/books?bibkeys=ISBN:${data.isbn}&jscmd=data&format=json`
            return { url: url }
        },
        "googlebook": () => {
            let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${data.isbn}&key=${process.env.GOOGLE_APP_API}`
            let short = `https://www.googleapis.com/books/v1/volumes?q=isbn:${data.isbn}`
            return { url: url, short: short }
        },
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
        },
        "openlibrary": () => {
            let dt = currentDate()
            let newRec = {
                name: data.title,
                openlibrary_id: data["identifiers"]["openlibrary"][0],
                notes: `Data fetched from [Openlibrary API](${data["urlInfo"]["url"]}) on ${dt}`,
                isbn: data['identifiers']['isbn_13'][0],
                publisher: `${data["publishers"][0]["name"]} , on ${data["publish_date"] ? data["publish_date"] : " "}`,
                added: dt,
                authors: []
            }
            if (data.subtitle) { newRec["subtitle"] = data.subtitle }
            if (data["identifiers"]["goodreads"]) {
                newRec["goodread_id"] = data["identifiers"]["goodreads"][0]
            }
            if (data.cover) { newRec["imageUrl"] = data["cover"]["medium"] }
            data.authors.map(auth => {
                if (newRec["authors"].indexOf(auth.name) == -1) {
                    newRec["authors"].push(auth.name)
                }
            })
            return newRec
        },
        "googlebook": () => {
            let dt = currentDate()

            let newRec = {
                isbn: data.bookISBN,
                added: dt,
                authors: []
            }
            newRec["name"] = data["volumeInfo"]["title"]
            newRec["subtitle"] = data["volumeInfo"]["subtitle"] ? data["volumeInfo"]["subtitle"] : ""
            newRec["authors"] = data["volumeInfo"]["authors"]

            // googlebook_url
            newRec["googlebook_url"] = data["volumeInfo"]["infoLink"]
            newRec["notes"] = `Data fetched from [Google Books API](${data["urlInfo"]["short"]}) on ${dt}`

            if (data["volumeInfo"]["imageLinks"]) { newRec["imageUrl"] = data["volumeInfo"]["imageLinks"]["thumbnail"] }

            if (data["volumeInfo"]["publisher"]) {
                newRec["publisher"] = `${data["volumeInfo"]["publisher"]} ,  ${data["volumeInfo"]["publishedDate"] ? data["volumeInfo"]["publishedDate"] : " "}`
            }
            let toLang = { "en": "English", "hi": "Hindi" }
            if (data["volumeInfo"]["language"]) {
                newRec["language"] = toLang[data["volumeInfo"]["language"]]
            }
            return newRec
        }
    }
    let sData = apis[apiType]()
    return sData
}
module.exports.structuredData = structuredData

let prettyPrint = (obj) => {console.log(JSON.stringify(obj, null, 2))}
module.exports.prettyPrint = prettyPrint