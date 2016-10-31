import styles from './index.scss';
import React from 'react';

import MapContainer from './components/MapContainer';
import SideBar from './components/SideBar';

import api from '../lib/api';

export default class App extends React.Component {
	constructor() {
		super();

		this.state = {};

		this.changeCurrentPerson = this.changeCurrentPerson.bind(this);
	}

	componentDidMount() {
		this.connectWithSocket();
	}

	connectWithSocket() {
		this.socket = io.connect('http://' + window.location.host);

		this.socket.on('persons list', this.storePersonsDetails.bind(this));
		this.socket.on('location update', this.updateLocation.bind(this));
		this.socket.on('state change', this.updateState.bind(this));
		this.socket.on('disconnect', this.updateStateAsOffline.bind(this));
	}

	updateStateAsOffline() {
		debugger;
		let newState = api.stateList.find(state => state.id === api.stateTypes.OFFLINE);

		this.state.personsDetail.forEach(person => {
			this.updateState({
				id: person.id,
				state: newState
			});
		});
	}

	updateState({personId, state}) {
		let personsDetail = this.state.personsDetail;

		let newPersonsDetail = personsDetail.map(person => {
			if (person.id !== personId) {
				return person;
			}

			return Object.assign({}, person, {
				state: state
			});
		});

		this.setState({ 'personsDetail': newPersonsDetail });
	}

	updateLocation(data) {
		let personId = data.personId;
		let newLocation = data.location;

		this.setState({
			locations: Object.assign({}, this.state.locations, {
				[personId]: this.state.locations[personId].concat(newLocation)
			})
		});
	}

	storePersonsDetails(persons) {
		let locations = {};

		persons.forEach(person => {
			locations[person.id] = [person.location];
		});

		let personsDetail = persons.map(person => ({
			name: person.name,
			id: person.id,
			state: person.state
		}));

		let currentPersonId = personsDetail[0].id;

		this.setState({
			locations,
			personsDetail,
			currentPersonId
		});
	}

	updateNewPosition() {
		let	lastPosition = this.state.positions[this.state.positions.length - 1].position;
		setTimeout(() => {
			let newPosition = {
				position: {
					lat: lastPosition.lat + 0.01,
					lng: lastPosition.lng + 0.01
				},
				title: 'hello ' + this.state.positions.length,
				label: 'End'
			};

			this.setState({'positions': this.state.positions.concat(newPosition)});

			this.updateNewPosition();
		}, 2000);
	}

	changeCurrentPerson(personId) {
		this.setState({ currentPersonId: personId });
	}

	render() {
		let currentPersonLocations;
		let locationMarkers;

		if (this.state.locations) {
			currentPersonLocations = this.state.locations[this.state.currentPersonId];

			locationMarkers = currentPersonLocations
				.filter((location, index) => {
					return index === 0 || index === currentPersonLocations.length - 1
				})
				.map((l, index) => ({
					position: l,
					label: index === 0 ? 'Start' : 'End'
				}));
		}

		return (
			<div className={styles.app}>
				{currentPersonLocations ?
					<div className={styles.mapContainer} >
						<MapContainer
							containerElement={
								<div style={{ height: `100%` }} />
							}
							mapElement={
								<div style={{ height: `100%` }} />
							}
							markers={ locationMarkers }
							polyline={ currentPersonLocations }
							center={ currentPersonLocations[0] }
						/>
						<SideBar
							persons={this.state.personsDetail}
							currentPersonId={this.state.currentPersonId}
							onPersonSelect={this.changeCurrentPerson} />
					</div>
					 : <div>loading...</div>}
			</div>
		)
	}
}
