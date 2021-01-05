var rp = require('request-promise');
const cheerio = require('cheerio');
const { reject } = require('bluebird');

let getMetaData = (url) => {
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
module.exports.getMetaData = getMetaData