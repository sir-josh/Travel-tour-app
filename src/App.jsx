import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";

const BASE_URL = "http://localhost:8000";

const App = () => {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchCities() {
			try {
				setIsLoading(true);
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				setCities(data);
			} catch {
				alert("there was an error, refresh page and try again");
			} finally {
				setIsLoading(false);
			}
		}
		fetchCities();
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/product" element={<Product />} />
				<Route path="/pricing" element={<Pricing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/app" element={<AppLayout />}>
					<Route
						index
						element={
							<CityList cities={cities} isLoading={isLoading} />
						}
					/>
					<Route
						path="cities"
						element={
							<CityList cities={cities} isLoading={isLoading} />
						}
					/>
					<Route path="countries" element={<p>Countries</p>} />
					<Route path="form" element={<p>Form</p>} />
				</Route>
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
