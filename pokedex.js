var http = require('http');
var fs = require('fs');
var async = require('async');

function download(item, key, callback) {
	var i = key + 1;
	var url = 'http://pokeapi.co/media/sprites/pokemon/' + i + '.png';
	var file = fs.createWriteStream('client/sprites/' + i + '.png');
	var request = http.get(url, function(response) {
		response.pipe(file);
		response.on('end', function() {
			console.log('Downloaded ' + item + ' sprite.');
			callback();
		});
	});
}

if (!fs.existsSync('client/sprites'))
    fs.mkdirSync('client/sprites');

var request = http.get('http://pokeapi.co/api/v2/pokemon/?limit=134', function(response) {
	var body = '';
	response.on('data', function(chunk) {
		body += chunk;
	});
	response.on('end', function() {
		var pokedex = [];
		var data = JSON.parse(body);
		for(var i in data['results']) {
			pokemon = data['results'][i];
			pokedex.push(pokemon['name']);
		}
		fs.writeFileSync('client/pokedex.json', JSON.stringify(pokedex));
		console.log('Wrote ' + pokedex.length + ' pokemon to pokedex.');
		async.eachOfSeries(pokedex, download, function() {
			process.exit(0);
		});
	});
}).on('error', function(e) {
	console.log('Got error: ' + e.message);
});
