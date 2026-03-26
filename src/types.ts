export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'cut' | 'regular' | 'bulk' | 'none';
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSizeGrams: number;
  icon?: string;
}

export interface DailyLog {
  date: string;
  items: FoodItem[];
}

export interface DietSuggestion {
  title: string;
  description: string;
  caloriesTarget: number;
  macrosTarget: {
    protein: number;
    carbs: number;
    fat: number;
  };
}
