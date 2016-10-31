import React from 'react';
import {
	withGoogleMap,
	GoogleMap,
	Marker,
	Polyline
} from 'react-google-maps';

const MapContainer = withGoogleMap(props => (
	<GoogleMap
		defaultZoom={14}
		center={props.center}
	>
		{props.markers.map(marker => (
			<Marker
				{...marker}
			/>
		))}

		<Polyline
			path={props.polyline}
			geodesic={true}
			strokeColor={'#FF0000'}
			strokeOpacity={1.0}
			strokeWeight={2}
				/>
	</GoogleMap>
));

export default MapContainer;
