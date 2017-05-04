const cheerio = require('cheerio');
const axios = require('axios');


const URL = `https://www.therapie.de/psychotherapie/-ergebnisse-/?ort=Berlin&abrechnungsverfahren=2&page=1`


axios.get(URL)
    .then(response => {
        const $ = cheerio.load(response.data)

        // selektor svih a tagova i kreiranje urlova za doktore, te pokretanje funkcije za otvaranje pojedinacnog itema
        $('.search-results-details-container a').map(function(i, item) { 
        let itemUrl = `https://www.therapie.de/${$(item).attr('href')}`;

         openItem(itemUrl)
       })
    })
    .catch(err => console.log('umrla konekcija'))



function openItem(itemUrl) {
    // console.log('treba bit 15 urlova')
}


axios.get('https://www.therapie.de/psychotherapie/david.pfister/')
    .then(response => {
        const $ = cheerio.load(response.data)

        let mail = $('#microsite > div:nth-child(1) > div.clearfix > div.therapist-name > div.therapist-details-mail.icon-mail > a')

        let test = $('a').attr('itemprop', 'email')
        console.log('test', test)
        // console.log(mail, 'mejl')
    })
