const cheerio = require('cheerio');
const axios = require('axios');
const json2csv = require('json2csv');
const fs = require('fs');


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
		let fields = ['Name', 'Email'];
		let csv = json2csv({ data: itemResults, fields: fields });
		
		fs.writeFile('doktori.csv', csv, function(err) {
			if (err) throw err;
			console.log('file saved');
		});
	})
	.catch(err => console.log('umrla konekcija'))
}


function openItem(itemUrl) {
	// ovo treba u funkciju da otvara pojedinacne doktore
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