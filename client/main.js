s_position = null;

$(document).ready(function() {

	var socket = io();
	
	$('form').submit(function() {
		var message = {
			'pokemon': $('input').val(),
			'position': [s_position.latitude, s_position.longitude]
		};
		socket.emit('ping', message);
		$('input').val('');
		return false;
	});

	socket.on('ping', function(ping) {
		var text = 'Saw ' + (ping.pokemon ? ping.pokemon : 'pokemon');
		text += ' at ' + ping.position[0] + ', ' + ping.position[1] + '!';
		$('ul').append($('<li>').text(text));
	});

	if (navigator && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
	} else {
		errorCallback();
	}

	$.getJSON('pokedex.json', function(data) {
		$('#pokedex').empty();
		for(var i in data) {
			var id = parseInt(i) + 1;
			var pokemon = $('<img />')
				.attr('src', 'sprites/' + id + '.png')
				.attr('title', data[id])
				.attr('data-id', id);
			$('#pokedex').append(pokemon);
		}
	});

	$('#pokedex').on('click', 'img', function() {
		$('input').val($(this).attr('data-id'));
	});

});

function errorCallback() {
	console.log('Geolocation is not supported!');
}
 
function successCallback(position) {
	var mapUrl = "http://maps.google.com/maps/api/staticmap?center=";
	mapUrl += position.coords.latitude + ',' + position.coords.longitude;
	mapUrl += '&zoom=15&size=512x512&maptype=roadmap&sensor=false';
	$("#map img").attr('src', mapUrl);
	s_position = position.coords;
}
