import React, { useState } from "react";
import { fetchNutritionData } from "../components/food";
import "./food.css"; // Import the CSS file

function Food() {
  const [foodQuery, setFoodQuery] = useState("");
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!foodQuery) {
      alert("Please enter a food name.");
      return;
    }

    setLoading(true);
    setError("");
    setNutritionData(null);

    try {
      const data = await fetchNutritionData(foodQuery);
      if (data.length > 0) {
        setNutritionData(data[0]);
      } else {
        setError("No data found.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-container">
      <h2 className="food-heading">Food Nutrition Information</h2>
      <input
        type="text"
        className="food-input"
        value={foodQuery}
        onChange={(e) => setFoodQuery(e.target.value)}
        placeholder="Enter food item"
      />
      <button className="food-button" onClick={handleSubmit}>
        Get Nutrition
      </button>

      {loading && <p className="food-loading">Loading...</p>}
      {error && <p className="food-error">{error}</p>}
      {nutritionData && (
        <div className="food-data">
          <h3 className="food-data-heading">Nutrition for: {foodQuery}</h3>
          <p><strong>Total_fat:</strong> {nutritionData.fat_total_g} kcal</p>
          <p><strong>Saturated_fat:</strong> {nutritionData.fat_saturated_g} g</p>
          <p><strong>Sodium:</strong> {nutritionData.sodium_mg} g</p>
          <p><strong>Carbohydrates:</strong> {nutritionData.carbohydrates_total_g} g</p>
          <p><strong>Fiber:</strong> {nutritionData.fiber_g} g</p>
          <p><strong>Sugar:</strong> {nutritionData.sugar_g} g</p>
        </div>
      )}
    </div>
  );
}

export default Food;
