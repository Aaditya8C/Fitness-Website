// Function to fetch nutrition data
export async function fetchNutritionData(foodQuery) {
  const apiKey = "PKfVH06B7qAAunsnNLgHRA==LUbTrxGUqmhghLIZ";
  const endpoint = `https://api.api-ninjas.com/v1/nutrition?query=${foodQuery}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { "X-Api-Key": apiKey },
    });

    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}
