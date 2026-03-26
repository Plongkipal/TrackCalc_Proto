import { UserProfile, FoodItem, DietSuggestion } from "../types";

// Local food database for offline use
const LOCAL_FOOD_DB: Record<string, Omit<FoodItem, 'id'>> = {
  "apple": { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSizeGrams: 182, icon: "🍎" },
  "banana": { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSizeGrams: 118, icon: "🍌" },
  "chicken breast": { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSizeGrams: 100, icon: "🍗" },
  "rice": { name: "White Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSizeGrams: 100, icon: "🍚" },
  "egg": { name: "Boiled Egg", calories: 78, protein: 6, carbs: 0.6, fat: 5, servingSizeGrams: 50, icon: "🥚" },
  "avocado": { name: "Avocado", calories: 160, protein: 2, carbs: 8.5, fat: 14.7, servingSizeGrams: 100, icon: "🥑" },
  "oats": { name: "Oats", calories: 389, protein: 16.9, carbs: 66, fat: 6.9, servingSizeGrams: 100, icon: "🥣" },
  "milk": { name: "Milk", calories: 42, protein: 3.4, carbs: 5, fat: 1, servingSizeGrams: 100, icon: "🥛" },
  "salmon": { name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, servingSizeGrams: 100, icon: "🐟" },
  "broccoli": { name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSizeGrams: 100, icon: "🥦" },
  "sweet potato": { name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSizeGrams: 100, icon: "🍠" },
  "almonds": { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 49, servingSizeGrams: 100, icon: "🥜" },
  "peanut butter": { name: "Peanut Butter", calories: 588, protein: 25, carbs: 20, fat: 50, servingSizeGrams: 100, icon: "🥜" },
  "greek yogurt": { name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSizeGrams: 100, icon: "🍦" },
  "quinoa": { name: "Quinoa", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, servingSizeGrams: 100, icon: "🌾" },
  "honey": { name: "Honey", calories: 304, protein: 0.3, carbs: 82, fat: 0, servingSizeGrams: 100, icon: "🍯" },
  "dates": { name: "Dates", calories: 282, protein: 2.5, carbs: 75, fat: 0.4, servingSizeGrams: 100, icon: "🌴" },
  "coconut water": { name: "Coconut Water", calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, servingSizeGrams: 100, icon: "🥥" },
  "water": { name: "Water", calories: 0, protein: 0, carbs: 0, fat: 0, servingSizeGrams: 250, icon: "💧" },
};

export async function getFoodNutrition(foodName: string): Promise<FoodItem> {
  const normalized = foodName.toLowerCase().trim();
  const found = LOCAL_FOOD_DB[normalized] || Object.values(LOCAL_FOOD_DB).find(f => normalized.includes(f.name.toLowerCase()));

  if (found) {
    return {
      ...found,
      id: Math.random().toString(36).substr(2, 9)
    };
  }

  // Fallback for unknown items
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: foodName,
    calories: 100,
    protein: 5,
    carbs: 15,
    fat: 2,
    servingSizeGrams: 100,
    icon: "🍽️"
  };
}

export async function getPersonalizedSuggestions(profile: UserProfile): Promise<DietSuggestion> {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
  } else {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const tdee = bmr * activityMultipliers[profile.activityLevel];
  let caloriesTarget = tdee;

  let title = "Maintenance Plan";
  let description = "Your body's baseline for health and vitality.";

  if (profile.goal === 'cut') {
    caloriesTarget = tdee - 500;
    title = "Precision Cut";
    description = "A sustainable deficit to reveal your hard-earned muscle.";
  } else if (profile.goal === 'bulk') {
    caloriesTarget = tdee + 300;
    title = "Growth Phase";
    description = "Fueling your strength gains with a controlled surplus.";
  } else if (profile.goal === 'none') {
    title = "Pure Tracking";
    description = "No targets, just awareness. Enjoy the journey.";
  }

  // Macro split (Protein: 30%, Carbs: 40%, Fat: 30%)
  const protein = (caloriesTarget * 0.3) / 4;
  const carbs = (caloriesTarget * 0.4) / 4;
  const fat = (caloriesTarget * 0.3) / 9;

  return {
    title,
    description,
    caloriesTarget: Math.round(caloriesTarget),
    macrosTarget: {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    }
  };
}
