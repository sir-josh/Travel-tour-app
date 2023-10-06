import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");

	return (
		<div className={styles.mapContainer} onClick={() => {navigate("form")}}>
			Your position cordinate are: <br />
			Latitude: {lat} <br /> Longitude: {lng}
		</div>
	);
}

export default Map;
