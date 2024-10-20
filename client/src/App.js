import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main/main";
import Signup from "./components/Singup/signup"; // Note the corrected spelling from "Singup" to "Signup"
import Login from "./components/Login/login";
import Favorites from "./components/Favorites/favorites"; // New component for favorites

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{/* Redirect to the login page if the user is not logged in */}
			<Route path="/" element={user ? <Main /> : <Navigate replace to="/login" />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/login" element={<Login />} />
			{user && <Route path="/favorites" element={<Favorites />} />} {/* Protect favorites route */}
		</Routes>
	);
}

export default App;
