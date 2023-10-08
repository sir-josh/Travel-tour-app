import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: "",
};

function reducer(state, action) {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };
		case "cities/loaded":
			return {
				...state,
				isLoading: false,
				cities: action.payload,
			};
		case "currentCity/loaded":
			return {
				...state,
				isLoading: false,
				currentCity: action.payload,
			};
		case "city/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		case "city/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter(
					(city) => city.id !== action.payload,
				),
				currentCity: {},
			};
		case "rejected":
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		default:
			throw new Error("Unknown action type");
	}
}

function CitiesProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { cities, isLoading, currentCity } = state;

	useEffect(() => {
		async function fetchCities() {
			dispatch({ type: "loading" });
			try {
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				dispatch({ type: "cities/loaded", payload: data });
			} catch {
				dispatch({
					type: "rejected",
					payload: "there was an error, refresh page and try again",
				});
			}
		}
		fetchCities();
	}, []);

	async function getCity(id) {
		if (Number(id) === currentCity.id) return;

		dispatch({ type: "loading" });
		try {
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			dispatch({ type: "currentCity/loaded", payload: data });
		} catch {
			dispatch({
				type: "rejected",
				payload: "there was an error, refresh page and try again",
			});
		}
	}

	async function addNewCity(newcity) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch(`${BASE_URL}/cities`, {
				method: "POST",
				body: JSON.stringify(newcity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			dispatch({ type: "city/created", payload: data });
		} catch {
			dispatch({
				type: "rejected",
				payload:
					"there was an error adding new city, refresh page and try again",
			});
		}
	}

	async function deleteCity(id) {
		dispatch({ type: "loading" });
		try {
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});

			dispatch({ type: "city/deleted", payload: id });
		} catch {
			dispatch({
				type: "rejected",
				payload:
					"there was an error in deleting city, refresh page and try again",
			});
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				addNewCity,
				deleteCity,
			}}>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	const context = useContext(CitiesContext);
	if (context === undefined)
		throw new Error("CitiesContext was used outside the CitiesProvider");
	return context;
}

export { CitiesProvider, useCities };
