'use strict';

const Faker = require('Faker');

const errorStatus = {
	TIMEOUT: 408,
	INTERNAL_SERVER_ERROR: 500,
	NOT_FOUND: 404,
	DISABLED: 405
};

const stateTypes = {
	ACTIVE: 0,
	DISABLED: 1,
	OFFLINE: 2
};

const stateList = [{
		id: stateTypes.ACTIVE,
		text: 'active'
	}, {
		id: stateTypes.DISABLED,
		text: 'disabled'
	}, {
		id: stateTypes.OFFLINE,
		text: 'offline'
	}];

function getRandomBetween(min, max) {
	if (min > max) {
		let temp = min;
		min = max;
		max = temp;
	}

	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomName() {
	return Faker.Name.findName();
}

function getUniqId() {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
}

function getRandomLocation() {
	return {
		lat: getRandomBetween(9, 37),
		lng: getRandomBetween(68, 97)
	};
}

module.exports = {
	getRandomBetween: getRandomBetween,

	errorStatus: errorStatus,

	stateTypes: stateTypes,

	stateList: stateList,

	getRandomPerson() {
		return {
			id: getUniqId(),
			name: getRandomName(),
			location: getRandomLocation(),
			state: stateList[0] // always assign active state at first
		};
	},

	getDestinationFrom(origin) {
		let latShift = getRandomBetween(-5, 5) / 1000;
		let lngShift = getRandomBetween(-5, 5) / 1000;

		return {
			lat: origin.lat + latShift,
			lng: origin.lng + lngShift
		};
	}
};
