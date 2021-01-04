const https = require('https');

let currentDate = () => {
    let d = new Date();
    let day = d.getDate() > 9 ? d.getDate() : ("0" + d.getDate());
    let month = (d.getMonth() + 1 > 9 ? (d.getMonth() + 1) : ("0" + (d.getMonth() + 1)))
    let year = d.getFullYear()
    let str = day + "-" + month + "-" + year
    return str
}

let genApiURL = (list) => {
    // openlibrary api
    let apiStart = "https://openlibrary.org/api/books?bibkeys="
    let apiEnd = "&jscmd=data&format=json"
    let url = apiStart;
    list.map(itm => {
        if (!itm) { throw new Error("Invalid ISBN") }
        if (itm.trim().length == 0) { throw new Error("Invalid ISBN") }
        url += "ISBN:" + itm + ","
    })
    url = url.substring(0, url.length - 1);
    url += apiEnd

    // googlebook api
    let startUrl = "https://www.googleapis.com/books/v1/volumes?q=isbn:"
    let endUrl = `&key=${process.env.GOOGLE_APP_API}`
    let apis = []
    list.map(isb => {
        apis.push(
            {
                isbn: isb,
                url: `${startUrl}${isb}${endUrl}`,
                short: `${startUrl}${isb}`
            }
        )
    })
    return { openlibrary: url, googleBook: apis }
}

let generateRecord = (apiType, isbn, data) => {
    let dt = new Date()
    let ur = genApiURL([isbn])
    let newRec = {
        isbn: isbn,
        added: currentDate(),
        authors: []
    }
    if (apiType == "openlibrary") {
        newRec["name"] = data.title
        newRec["openlibrary_id"] = data["identifiers"]["openlibrary"][0]
        newRec["notes"] = `Data fetched from [Openlibrary API](${ur["openlibrary"]}) on ${dt}`
        newRec["publisher"] = `${data["publishers"][0]["name"]} , on ${data["publish_date"] ? data["publish_date"] : " "}`

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

    } else if (apiType == "googleBook") {
        newRec["name"] = data["volumeInfo"]["title"]
        newRec["subtitle"] = data["volumeInfo"]["subtitle"] ? data["volumeInfo"]["subtitle"] : ""
        newRec["authors"] = data["volumeInfo"]["authors"]
        
        // googlebook_url
        newRec["googlebook_url"] = data["volumeInfo"]["infoLink"]
        newRec["notes"] = `Data fetched from [Google Books API](${ur["googleBook"][0]["short"]}) on ${dt}`

        if (data["volumeInfo"]["imageLinks"]) { newRec["imageUrl"] = data["volumeInfo"]["imageLinks"]["thumbnail"] }

        if (data["volumeInfo"]["publisher"]) {
            newRec["publisher"] = `${data["volumeInfo"]["publisher"]} ,  ${data["volumeInfo"]["publishedDate"] ? data["volumeInfo"]["publishedDate"] : " "}`

        }
        let validLang = { "en": "English", "hi": "Hindi" }
        if (data["volumeInfo"]["language"]) {
            newRec["language"] = validLang[data["volumeInfo"]["language"]]
        }
    }
    return newRec
}

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


let getBookDetails = async (isbnList) => {
    try {
        let url1 = genApiURL(isbnList)
        let req = await getData(url1["openlibrary"])
        let data = req
        let books = []
        Object.keys(data).map(isbn => {
            let isb = isbn.split(":")
            books.push(generateRecord("openlibrary", isb[1], data[isbn]))
        })
        let notFound = []
        isbnList.map(bk => {
            if (!data["ISBN:" + bk]) { notFound.push(bk) }
        })
        // attempting to search in google books
        //  print(JSON.stringify(url))
        for (var j = 0; j <= notFound.length - 1; j++) {
            // print(notFound[j])
            let gurl1 = url1["googleBook"].find(itm => { return itm.isbn == notFound[j] })
            // print(gurl1)
            // print(gurl1["url"])
            let bookData = await getData(gurl1["url"])
            if (bookData.totalItems > 0) {
                books.push(
                    generateRecord("googleBook", gurl1["isbn"], bookData["items"][0])
                )
            }
        }
        let finalNF = []
        isbnList.map(itm1 => {
            let ser = books.find(itm => { return itm.isbn == itm1 })
            if (!ser) { finalNF.push(itm1) }
        })
        return { found: books, notFound: finalNF }
    } catch (error) {
        throw error
    }

}
module.exports.getBookDetails = getBookDetails;