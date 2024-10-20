import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Header from "../Header/Header";
import logo from "../Images/logo.png";

const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		mobile: "",
		password: "",
		confirmpassword: "" // Ensure this is included
	});
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });

		// Check if the input is the confirmation password
		if (input.name === "confirmpassword") {
			if (input.value !== data.password) {
				setError("The password does not match");
			} else {
				setError(""); // Clear error if passwords match
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check password match on frontend
		if (data.password !== data.confirmpassword) {
			setError("The password does not match");
			return;
		}

		try {
			const url = "http://localhost:5000/api/users";
			const { data: res } = await axios.post(url, {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				mobile: data.mobile,
				password: data.password,
			}); // Exclude the confirmpassword field in the request

			setMsg(res.message);
			setError("");
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
				setMsg("");
			}
		}
	};

	return (
		<>
			<Header />
			<div className={styles.signup_container}>
				<div className={styles.signup_form_container}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<div className={styles.logo_container}>
							<img src={logo} alt="Logo" className={styles.logo} />
						</div>

						<h1>Register</h1>
						<div className={styles.input_row}>
							<div className={styles.input_column}>
								<input
									type="text"
									placeholder="First name"
									name="firstName"
									onChange={handleChange}
									value={data.firstName}
									required
									className={styles.input}
								/>
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
								<button type="submit" className={styles.create_btn}>
									Create Account
								</button>
							</div>
							<div className={styles.input_column}>
								<input
									type="text"
									placeholder="Last name"
									name="lastName"
									onChange={handleChange}
									value={data.lastName}
									required
									className={styles.input}
								/>
								<input
									type="text"
									placeholder="Phone number"
									name="mobile"
									onChange={handleChange}
									value={data.mobile}
									required
									className={styles.input}
								/>
								<input
									type="password"
									placeholder="Confirm Password"
									name="confirmpassword"
									onChange={handleChange}
									value={data.confirmpassword}
									required
									className={styles.input}
								/>
							</div>
						</div>
						{error && <div className={styles.error_msg}>{error}</div>}
						{msg && <div className={styles.success_msg}>{msg}</div>}
						<div className={styles.link_container}>
							<span>Already have an account? </span>
							<Link to="/login" className={styles.login_link}>Login</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Signup;
