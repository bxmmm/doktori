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


axios.get('https://www.therapie.de/psychotherapie/rinderspacher/')
    .then(response => {
        const $ = cheerio.load(response.data)

        let nameData = $('div.therapist-name > h1').text()
        let name = nameData.slice(2);

        let emailData = $('div.therapist-details-mail.icon-mail > a').text()
        let email = emailData.slice(17).slice(0, 28)
        console.log('email', email, 'name', name)
    })git push origin master