import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import { formatDate, countryFlag } from "../utils/ContryCodeUtil";

function CityItem({ city }) {
	const { currentCity, deleteCity } = useCities();
	const { cityName, emoji, date, id, position } = city;

	function handleDelete(e) {
		e.preventDefault();
		deleteCity(id);
	}

	return (
		<li>
			<Link
				to={`${id}?lat=${position.lat}&lng=${position.lng}`}
				className={`${styles.cityItem} ${
					id === currentCity.id ? styles["cityItem--active"] : ""
				}`}>
				<span className={styles.emoji}>{countryFlag(emoji)}</span>
				<h3 className={styles.name}>{cityName}</h3>
				<time className={styles.date}>{formatDate(date)}</time>
				<button className={styles.deleteBtn} onClick={handleDelete}>
					&times;
				</button>
			</Link>
		</li>
	);
}

export default CityItem;
