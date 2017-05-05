const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const converter = require('json-2-csv');


let page = 1
let URL = `https://www.therapie.de/psychotherapie/-ergebnisse-/?ort=Berlin&abrechnungsverfahren=2&page=${page}`
let itemResults = [];


function getData() {
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
	.then(() => {
		page = page + 1
		URL = `https://www.therapie.de/psychotherapie/-ergebnisse-/?ort=Berlin&abrechnungsverfahren=2&page=${page}`
		console.log('url', URL)
		// obzirom da ima 73 page-a ne treba vjecno pozivati funkciju
		if(page < 74) {
			getData()
		}
	})
	.then(() => {
		let json2csvCallback = function (err, csv) {
				if (err) throw err;
					fs.writeFile('doktori.csv', csv, function(err) {
				if (err) throw err;
				console.log('saved');
			});
		};
		converter.json2csv(itemResults, json2csvCallback);
	})
	.catch(err => console.log('umrla konekcija'))
}

// funkcija za otvaranje pojedinacnih doktora
function openItem(itemUrl) {
	axios.get(itemUrl)
	.then(response => {
		const $ = cheerio.load(response.data);

		let nameData = $('div.therapist-name > h1').text();
		let emailData = $('div.therapist-details-mail.icon-mail > a').text();

		let mail = emailData.trim();
		let name = nameData.trim();
		if(mail.length > 0) {
			let obj = { name, mail }
			itemResults.push(obj)
		}
	})
}

getData();