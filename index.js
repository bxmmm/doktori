const cheerio = require('cheerio');
const axios = require('axios');


const URL = `https://www.therapie.de/psychotherapie/-ergebnisse-/?ort=Berlin&abrechnungsverfahren=2&page=1`


axios.get(URL)
    .then(response => {
        const $ = cheerio.load(response.data)

        // selektor svih a tagova i kreiranje urlova za doktore, te pokretanje funkcije za otvaranje pojedinacnog itema
        $('.search-results-details-container a').map(function(i, item) { 
        let itemUrl = `https://www.therapie.de/${$(item).attr('href')}`;
        // funkcija za pojedinacne iteme
         openItem(itemUrl)
       })
    })
    .catch(err => console.log('umrla konekcija'))



function openItem(itemUrl) {
    // console.log('treba bit 15 urlova')
}


// ovo treba u funkciju da otvara pojedinacne doktore
axios.get('https://www.therapie.de/psychotherapie/assmann/')
    .then(response => {
        const $ = cheerio.load(response.data)

        let nameData = $('div.therapist-name > h1').text()
        let emailData = $('div.therapist-details-mail.icon-mail > a').text()

        let mail = emailData.trim()
        let name = nameData.trim()
        console.log('email', mail, 'name', name)
    })