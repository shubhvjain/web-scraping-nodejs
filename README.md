### Various web scraping tasks
---
#### Get details of book from ISBN number 

Data is fetched fom the following sources - 
- [Open Library API](https://openlibrary.org/developers/api)  
- [Google Books API](https://developers.google.com/books/docs/v1/getting_started)

To use the Google Books API, API key is required. [More Information](https://developers.google.com/books/docs/v1/using#APIKey)

```{js}
const book = require("./book")

let data = await book.getBookDetails(["9780141005942","9781408890257"])
```
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