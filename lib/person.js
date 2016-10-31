'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const Faker = require('Faker');

const api = require('../lib/api');

const Person = function(obj) {
	this.location = obj.location;
	this.name = obj.name;
	this.id = obj.id;
	this.state = obj.state;
};

Person.prototype.setState = function(stateType) {
	if (this.state.id === stateType) { return; }

	let newState = api.stateList.find((state) => state.id === stateType);

	this.state = newState;
	this.emit('change:state', newState);
};

Person.prototype.updateLocation = function(newLocation) {
	this.location = newLocation;
	this.emit('change:location', newLocation);
};

util.inherits(Person, EventEmitter);

module.exports = Person;
