'use strict';

const socketio = require('socket.io');
const personService = require('../services/personService');

module.exports.setup = function(server) {
	let io = socketio(server);
	let persons = [];

	personService.getPersons()
		.then(personList => {
			persons = personList;

			persons.map(person => {
				person
					.on('change:location', (newLocation) => {
						io.sockets.emit('location update', {
							personId: person.id,
							location: newLocation
						});
					})
					.on('change:state', (newState) => {
						io.sockets.emit('state change', {
							personId: person.id,
							state: newState
						})
					});
			});
		});

	io.sockets.on('connection', function (socket) {
		io.sockets.emit('persons list', persons.map(p => ({
			id: p.id,
			name: p.name,
			state: p.state,
			location: p.location
		})));
	});
}
