import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Header from "../Header/Header"; // Adjust path if necessary

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user._id) return; // No user logged in

            try {
                const res = await axios.get(`http://localhost:5000/api/favorites/${user._id}`);
                console.log("Favorites fetched:", res.data); // Log the fetched data
                setFavorites(res.data);
            } catch (err) {
                console.error("Error fetching favorites:", err);
                setError("Could not load favorites.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    const handleDelete = async (recipeId) => {
        if (!user._id) return; // No user logged in

        try {
            await axios.delete("http://localhost:5000/api/favorites", {
                data: { userId: user._id, recipeId },
            });
            // Update the local state to remove the deleted recipe
            setFavorites(favorites.filter(fav => fav.idMeal !== recipeId));
            console.log("Favorite deleted successfully");
        } catch (err) {
            console.error("Error deleting favorite:", err);
            setError("Could not delete favorite.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Header />
            <div className={styles.favorites_container}>
                <h1>Your Favorite Recipes</h1>
                <div className={styles.recipe_grid}>
                    {favorites.length === 0 ? (
                        <p>No favorites added yet.</p>
                    ) : (
                        favorites.map((recipe) => (
                            <div key={recipe.idMeal} className={styles.recipe_card}>
                                <img
                                    src={recipe.strMealThumb}
                                    alt={recipe.strMeal}
                                    className={styles.recipe_img}
                                />
                                <div className={styles.recipe_info}>
                                    <span className={styles.recipe_name}>
                                        {recipe.strMeal}
                                    </span>
                                    <svg
                                        onClick={() => handleDelete(recipe.idMeal)} // Call delete function on click
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill={favorites.some(fav => fav.idMeal === recipe.idMeal) ? "pink" : "none"} // Fill for favorited
                                        stroke="black"
                                        className={styles.heart_icon}
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M8 15s-7-4.35-7-9.36C1 2.66 3.58 0 8 0c4.42 0 7 2.66 7 5.64C15 10.65 8 15 8 15z"
                                            strokeWidth="2" // Set stroke width for outline
                                        />
                                    </svg>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Favorites;
