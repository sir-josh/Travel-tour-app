import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { countryFlag } from "../utils/ContryCodeUtil";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";

function Map() {
	const [mapPosition, setMapPosition] = useState([6.52, 3.37]);
	const {
		getPosition,
		isLoading: isLoadingPosition,
		position: geoLocationPosition,
	} = useGeolocation();

	const [searchParams] = useSearchParams();
	const { cities } = useCities();

	const mapLat = searchParams.get("lat");
	const mapLng = searchParams.get("lng");

	useEffect(
		function () {
			if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
		},
		[mapLat, mapLng],
	);

	useEffect(
		function () {
			if (geoLocationPosition) {
				console.log(geoLocationPosition);
				setMapPosition([
					geoLocationPosition.lat,
					geoLocationPosition.lng,
				]);
			}
		},
		[geoLocationPosition],
	);

	return (
		<div className={styles.mapContainer}>
			{!geoLocationPosition && (
				<Button type="position" onClick={getPosition}>
					{isLoadingPosition ? "Loading..." : "Use your position"}
				</Button>
			)}
			<MapContainer
				className={styles.map}
				center={mapPosition}
				zoom={6}
				scrollWheelZoom={true}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities.map((city) => (
					<Marker
						position={[city.position.lat, city.position.lng]}
						key={city.id}>
						<Popup>
							<span>{countryFlag(city.emoji)}</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}

				<ChangeMapPositionView position={mapPosition} />
				<DetectMapPositionClick />
			</MapContainer>
		</div>
	);
}

function ChangeMapPositionView({ position }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectMapPositionClick() {
	const navigate = useNavigate();

	useMapEvents({
		click: (e) => {
			navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
		},
	});
}

export default Map;
