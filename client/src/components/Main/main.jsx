import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Header from "../Header/Header";

const Main = () => {
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("pork");
	const [recipes, setRecipes] = useState([]);
	const [favoritedRecipes, setFavoritedRecipes] = useState(new Set());
	const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

	// Fetch categories when the component mounts
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await axios.get(
					"https://www.themealdb.com/api/json/v1/1/categories.php"
				);
				setCategories(res.data.categories.slice(0, 5));
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};

		fetchCategories();
	}, []);

	// Fetch recipes based on the selected category
	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const res = await axios.get(
					`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
				);
				setRecipes(res.data.meals);
			} catch (error) {
				console.error("Error fetching recipes:", error);
			}
		};

		if (selectedCategory) fetchRecipes();
	}, [selectedCategory]);

	// Function to add a recipe to favorites
	const handleAddToFavorites = async (recipe) => {
		if (!user._id) {
			alert("Please log in to add favorites.");
			return;
		}

		try {
			await axios.post("http://localhost:5000/api/favorites", {
				userId: user._id,
				recipeId: recipe.idMeal,
			});

			// Update local state and local storage for favorites
			const updatedFavorites = new Set(favoritedRecipes);
			if (updatedFavorites.has(recipe.idMeal)) {
				updatedFavorites.delete(recipe.idMeal); // Remove from favorites
			} else {
				updatedFavorites.add(recipe.idMeal); // Add to favorites
			}
			setFavoritedRecipes(updatedFavorites);
		} catch (error) {
			console.error("Error adding to favorites:", error);
		}
	};

	return (
		<>
			<Header />

			<div className={styles.main_container}>
				<div className={styles.category_buttons}>
					{categories.map((category) => (
						<button
							key={category.idCategory}
							className={
								selectedCategory === category.strCategory
									? styles.active_category
									: styles.category_btn
							}
							onClick={() => setSelectedCategory(category.strCategory)}
						>
							{category.strCategory}
						</button>
					))}
				</div>

				<div className={styles.recipe_grid}>
					{recipes.map((recipe) => (
						<div key={recipe.idMeal} className={styles.recipe_card}>
							<img
								src={recipe.strMealThumb}
								alt={recipe.strMeal}
								className={styles.recipe_img}
							/>
							<span>
								{recipe.strMeal}
								<button
									onClick={() => handleAddToFavorites(recipe)}
									className={`${styles.favorite_btn} ${
										favoritedRecipes.has(recipe.idMeal) ? styles.favorited : ""
									}`}
								>
									{/* Heart Icon */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										fill={favoritedRecipes.has(recipe.idMeal) ? "pink" : "none"}
										stroke={favoritedRecipes.has(recipe.idMeal) ? "pink" : "black"}
										className="bi bi-heart"
										viewBox="0 0 16 16"
									>
										<path
											d="M8 15s-7-4.35-7-9.36C1 2.66 3.58 0 8 0c4.42 0 7 2.66 7 5.64C15 10.65 8 15 8 15z"
											strokeWidth="2"
										/>
									</svg>
								</button>
							</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Main;
