'use strict';

const Person = require('../lib/person');
const api = require('../lib/api');
const config = require('../lib/config');

const API_TIMEOUT = config.API_TIMEOUT;
const FETCH_INTERVAL = config.FETCH_INTERVAL;

let persons = [];

function createPersons(n) {
	persons = [];

	for(let i = 0; i < n; i++) {
		let personDetails = api.getRandomPerson();

		let person = new Person(personDetails);

		persons.push(person);
	}

	persons.forEach(person => {
		fetchAndUpdateLocationPeriodically(person);
	});

	return persons;
}

function fetchAndUpdateLocationPeriodically(person) {
	getLocation(person.id, {
			timeout: API_TIMEOUT
		})
		.then((newLocation) => {
			console.log('success', newLocation);
			person.updateLocation(newLocation);
			person.setState(api.stateTypes.ACTIVE);

			setTimeout(() => {
				fetchAndUpdateLocationPeriodically(person);
			}, FETCH_INTERVAL);
		}, (err) => {
			console.log('error', err);

			if (err.statusCode === api.errorStatus.TIMEOUT) {
				// set state as offline and retry
				person.setState(api.stateTypes.OFFLINE);

				setTimeout(() => {
					fetchAndUpdateLocationPeriodically(person);
				}, FETCH_INTERVAL);

			} else if (err.statusCode === api.errorStatus.DISABLED) {
				// stop retrying
				person.setState(api.stateTypes.DISABLED);
			} else {
				// try again
				console.error(err);

				setTimeout(() => {
					fetchAndUpdateLocationPeriodically(person);
				}, FETCH_INTERVAL);
			}
		});
};

function getPersonById(personId) {
	if (!persons || !persons.length) {
		return null;
	}

	// console.log('aaaaaaaa', personId, persons);

	return persons.find(person => {
		return person.id === personId
	});
}

// again it's a function to get next position somewhat similar in direction to previous steps
function getNextStep(person) {
	let destination = person.destination;

	if (!destination || person.stepsForDestination < 1) {
		destination = api.getDestinationFrom(person.location);
		person.destination = destination;
		person.stepsForDestination = 10;	// just a random number
	}

	let latShift = (person.destination.lat - person.location.lat) / person.stepsForDestination;
	let lngShift = (person.destination.lng - person.location.lng) / person.stepsForDestination;

	let newLocation = {
		lat: person.location.lat + latShift,
		lng: person.location.lng + lngShift
	};

	return newLocation;
}

// get it randomly, should be fetched from real api in realistic scenario
function getLocation(personId, options) {
	let timeout = options.timeout;

	return new Promise((resolve, reject) => {
		let person = getPersonById(personId);

		// set a random case when user wishes to stop sending location update
		if (Math.random() < config.DISABLE_PROBABILITY) {
			console.log('disabling person', person.name);

			return reject({
				statusCode: api.errorStatus.DISABLED,
				message: 'Not allowed access'
			});
		}

		// produce a scenario for timeout
		if (Math.random() < config.OFFLINE_PROBABILITY) {
			console.log('timeout for person', person.name);

			// create a time lag before timeout
			return setTimeout(() => {
				reject({
					statusCode: api.errorStatus.TIMEOUT,
					message: 'Request Timedout'
				});
			}, timeout);
		}

		// get next step
		let newLocation = getNextStep(person);
		person.stepsForDestination -= 1;

		return resolve(newLocation);
	});
}

module.exports = {
	getPersons() {
		return new Promise(resolve => {
			let n = api.getRandomBetween(2, 5);

			if (persons.length) {
				return persons;
			}

			persons = createPersons(n);

			return resolve(persons);
		});
	}
};
