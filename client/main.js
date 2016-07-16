s_position = null;

$(document).ready(function() {

	var socket = io();
	
	$('form').submit(function() {
		var message = {
			'pokemon': $('input').val(),
			'position': [s_position.latitude, s_position.longitude]
		};
		socket.emit('chat message', message);
		$('input').val('');
		return false;
	});

	socket.on('chat message', function(ping) {
		console.log('see', ping.position);
		var text = 'Saw ' + (ping.pokemon ? ping.pokemon : 'pokemon');
		text += ' at ' + ping.position[0] + ', ' + ping.position[1] + '!';
		$('ul').append($('<li>').text(text));
	});

	if (navigator && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
	} else {
		console.log('Geolocation is not supported');
	}

	$.getJSON('pokedex.json', function(data) {
		$('select').empty();
		for(var i in data) {
			var id = parseInt(i) + 1;
			var option = $('<option />').attr('value', id).text(data[id]);
			$('select').append(option);
		}
	});

	$('select').change(function() {
		$('input').val($('option:selected').attr('value'));
	});

});

function errorCallback() {}
 
function successCallback(position) {
	var mapUrl = "http://maps.google.com/maps/api/staticmap?center=";
	mapUrl += position.coords.latitude + ',' + position.coords.longitude;
	mapUrl += '&zoom=15&size=512x512&maptype=roadmap&sensor=false';
	$("img").attr('src', mapUrl);
	s_position = position.coords;
	console.log('set', s_position);
}
