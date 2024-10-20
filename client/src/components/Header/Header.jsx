import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import logo from "../Images/logo.png";

const Header = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to home page after logout
    };

    return (
        <header className={styles.header}>
            {/* Left Side - Logo */}
            <div className={styles.logo_container}>
                <Link to="/">
                    <img src={logo} alt="Logo" className={styles.logo} />
                </Link>
            </div>

            {/* Middle - Navigation Buttons */}
            <nav className={styles.nav_buttons}>
                <a href="/" className={styles.nav_link}>
                    Home
                </a>

                {/* Conditionally render the Favorites link */}
                {isLoggedIn && (
                    <Link to="/favorites" className={styles.nav_link}>
                        Favorites
                    </Link>
                )}
            </nav>

            {/* Right Side - Login/Logout Button */}
            <div className={styles.right_buttons}>
                {isLoggedIn ? (
                    <button className={styles.white_btn} onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <Link to="/login">
                        <button className={styles.white_btn}>Login</button>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
