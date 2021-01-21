**Prereq** : Get Google OAuth 2.0 client credentials. Learn more [here](https://developers.google.com/identity/protocols/oauth2). Some features like Google book API, Youtube API etc require that.

Define the API key in `GOOGLE_APP_API` environment variable 

----

### Get details of book from ISBN number 

Data is fetched fom the following sources - 
- [Open Library API](https://openlibrary.org/developers/api)  
- [Google Books API](https://developers.google.com/books/docs/v1/getting_started)

To use the Google Books API, API key is required. [More Information](https://developers.google.com/books/docs/v1/using#APIKey)

```{js}
const book = require("./book")
let data = await book.getBookDetails(["9780141005942","9781408890257"])
``` 
The `getBookDetails` method takes an array of ISBN numbers. 


Data returned will be of the following format : 

```
{
  "found": [
    {
      "isbn": "9780349121086",
      "added": "04-01-2021",
      "authors": [
        "David Foster Wallace"
      ],
      "name": "Infinite Jest",
      "openlibrary_id": "OL29007775M",
      "notes": "Data fetched from [Openlibrary API](https://openlibrary.org/api/books?bibkeys=ISBN:9780349121086&jscmd=data&format=json) on Mon Jan 04 2021 22:52:38 GMT+0530 (India Standard Time)",
      "publisher": "Little, Brown Book Group Limited , on 1997"
    },
    {
      "isbn": "9788120305960",
      "added": "04-01-2021",
      "authors": [
        "Brian W. Kernighan",
        "Dennis M. Ritchie"
      ],
      "name": "The C Programming Language",
      "subtitle": "",
      "googlebook_url": "http://books.google.co.in/books?id=-M9qQgAACAAJ&dq=isbn:9788120305960&hl=&source=gbs_api",
      "notes": "Data fetched from [Google Books API](https://www.googleapis.com/books/v1/volumes?q=isbn:9788120305960) on Mon Jan 04 2021 22:52:38 GMT+0530 (India Standard Time)",
      "publisher": "Ingram ,  1988",
      "language": "English"
    }
  ],
  "notFound": []
}
```

---
### Get webpage metadata from URL

```
const website = require("./website")
let siteData = await website.getMetaData("https://css-tricks.com/essential-meta-tags-social-media/")
```
Data returned : 

```
{
  "title": "\nThe Essential Meta Tags for Social Media ",
  "canonical": "https://css-tricks.com/essential-meta-tags-social-media/",
  "description": "These days, almost every website encourages visitors to share its pages on social media. We’ve all seen the ubiquitous Facebook and Twitter icons, among",
  "og_title": "The Essential Meta Tags for Social Media | CSS-Tricks",
  "og_url": "https://css-tricks.com/essential-meta-tags-social-media/",
  "og_img": "//css-tricks.com/wp-content/uploads/2016/06/facebook-card.jpg",
  "og_type": "article",
  "twitter_site": "@CSS"
}
```
----
### Get youtube video metadata 


