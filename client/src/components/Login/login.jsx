import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Header from "../Header/Header"
import logo from "../Images/logo.png";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.token); // Ensure 'res.token' contains the JWT token
			localStorage.setItem('user', JSON.stringify(res.user));
			window.location = "/"; // Redirect after login
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<>
		<Header/>
		<div className={styles.login_container}>

			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<div className={styles.logo_container}>
						<img src={logo} alt="Logo" className={styles.logo} />
					</div>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							SIGN IN
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<span>Don't have an account?</span>
					<Link to="/signup" className={styles.signup_text}>
						Create an account
					</Link>
				</div>
			</div>
		</div>
		</>
	);
};

export default Login;
