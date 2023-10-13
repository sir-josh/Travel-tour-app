import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/AuthContext";

import ProctectedRoutes from "./pages/ProctectedRoutes";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import PageNotFound from "./pages/PageNotFound";
// import Login from "./pages/Login";
// import AppLayout from "./pages/AppLayout";
import SpinnerFullPage from "./components/SpinnerFullPage";
import CountryList from "./components/CountryList";
import CityList from "./components/CityList";
import City from "./components/City";
import Form from "./components/Form";

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));

const App = () => {
	return (
		<AuthProvider>
			<CitiesProvider>
				<BrowserRouter>
					<Suspense fallback={<SpinnerFullPage />}>
						<Routes>
							<Route path="/" element={<Homepage />} />
							<Route path="/product" element={<Product />} />
							<Route path="/pricing" element={<Pricing />} />
							<Route path="/login" element={<Login />} />
							<Route
								path="/app"
								element={
									<ProctectedRoutes>
										<AppLayout />
									</ProctectedRoutes>
								}>
								{/* <Route index element={<CityList />} /> */}
								<Route
									index
									element={<Navigate to="cities" replace />}
								/>
								<Route path="cities" element={<CityList />} />
								<Route
									path="countries"
									element={<CountryList />}
								/>
								<Route path="cities/:id" element={<City />} />
								<Route path="form" element={<Form />} />
							</Route>
							<Route path="*" element={<PageNotFound />} />
						</Routes>
					</Suspense>
				</BrowserRouter>
			</CitiesProvider>
		</AuthProvider>
	);
};

export default App;
