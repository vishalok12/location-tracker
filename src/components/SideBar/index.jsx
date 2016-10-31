import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.scss';

import api from '../../../lib/api';

const SideBar = (props) => {
	function getStyle(stateType) {
		let stateTypes = api.stateTypes;

		switch(stateType) {
			case stateTypes.ACTIVE:
				return 'active';
			case stateTypes.DISABLED:
				return 'disabled';
			case stateTypes.OFFLINE:
				return 'offline';
		}
	}

	function getTitle(stateType) {
		let stateTypes = api.stateTypes;

		switch(stateType) {
			case stateTypes.ACTIVE:
				return 'Active';
			case stateTypes.DISABLED:
				return 'Disabled';
			case stateTypes.OFFLINE:
				return 'Offline';
		}
	}

	return (
		<ul styleName='sideBarContainer'>
			{
				props.persons.map(person => (
					props.currentPersonId === person.id ?
						<li
							key={person.id}
							styleName='selectedPersonInfo'
						>
							<div
								styleName={getStyle(person.state.id)}
								title={getTitle(person.state.id)}
							></div>
							{person.name}
						</li> :
						<li
							key={person.id}
							styleName='personInfo'
							onClick={() => { props.onPersonSelect(person.id); }}
						>
							<div
								styleName={getStyle(person.state.id)}
								title={getTitle(person.state.id)}
							></div>
							{person.name}
						</li>
				))
			}
		</ul>
	);
};

export default CSSModules(SideBar, styles);
