import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  User, 
  Activity, 
  Target, 
  Flame, 
  Utensils, 
  Trash2, 
  Scale,
  Ruler,
  Calendar,
  Sparkles,
  X,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { UserProfile, FoodItem, DietSuggestion } from './types';
import { getFoodNutrition, getPersonalizedSuggestions } from './services/gemini';
import { cn } from './lib/utils';

const FOOD_CATEGORIES = {
  PROTEIN: [
    { name: 'Egg', icon: '🥚', calories: 78, protein: 6, carbs: 0.6, fat: 5, grams: 50 },
    { name: 'Chicken', icon: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, grams: 100 },
    { name: 'Beef', icon: '🥩', calories: 250, protein: 26, carbs: 0, fat: 15, grams: 100 },
    { name: 'Fish', icon: '🐟', calories: 206, protein: 22, carbs: 0, fat: 12, grams: 100 },
    { name: 'Shrimp', icon: '🍤', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, grams: 100 },
    { name: 'Tofu', icon: '🧊', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, grams: 100 },
    { name: 'Milk', icon: '🥛', calories: 149, protein: 8, carbs: 12, fat: 8, grams: 240 },
    { name: 'Yogurt', icon: '🍦', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, grams: 100 },
    { name: 'Cheese', icon: '🧀', calories: 402, protein: 25, carbs: 1.3, fat: 33, grams: 100 },
    { name: 'Beans', icon: '🫘', calories: 139, protein: 9, carbs: 25, fat: 0.4, grams: 100 },
    { name: 'Lentils', icon: '🍲', calories: 116, protein: 9, carbs: 20, fat: 0.4, grams: 100 },
    { name: 'Pork', icon: '🥓', calories: 242, protein: 27, carbs: 0, fat: 14, grams: 100 },
    { name: 'Turkey', icon: '🦃', calories: 189, protein: 29, carbs: 0, fat: 7, grams: 100 },
    { name: 'Salmon', icon: '🍣', calories: 208, protein: 20, carbs: 0, fat: 13, grams: 100 },
  ],
  CARBS: [
    { name: 'Rice', icon: '🍚', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, grams: 100 },
    { name: 'Bread', icon: '🍞', calories: 79, protein: 2.7, carbs: 15, fat: 1, grams: 30 },
    { name: 'Potato', icon: '🥔', calories: 77, protein: 2, carbs: 17, fat: 0.1, grams: 100 },
    { name: 'Sweet Potato', icon: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, grams: 100 },
    { name: 'Corn', icon: '🌽', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, grams: 100 },
    { name: 'Pasta', icon: '🍝', calories: 131, protein: 5, carbs: 25, fat: 1.1, grams: 100 },
    { name: 'Oats', icon: '🥣', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, grams: 100 },
    { name: 'Quinoa', icon: '🍚', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, grams: 100 },
    { name: 'Bagel', icon: '🥯', calories: 250, protein: 10, carbs: 49, fat: 1.5, grams: 100 },
    { name: 'Noodles', icon: '🍜', calories: 138, protein: 4.5, carbs: 25, fat: 2.1, grams: 100 },
  ],
  FAT: [
    { name: 'Avocado', icon: '🥑', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, grams: 100 },
    { name: 'Peanuts', icon: '🥜', calories: 567, protein: 26, carbs: 16, fat: 49, grams: 100 },
    { name: 'Almonds', icon: '🌰', calories: 579, protein: 21, carbs: 22, fat: 50, grams: 100 },
    { name: 'Olive Oil', icon: '🫒', calories: 884, protein: 0, carbs: 0, fat: 100, grams: 100 },
    { name: 'Butter', icon: '🧈', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, grams: 100 },
    { name: 'Walnuts', icon: '🥜', calories: 654, protein: 15, carbs: 14, fat: 65, grams: 100 },
  ],
  ENERGY: [
    { name: 'Honey', icon: '🍯', calories: 304, protein: 0.3, carbs: 82, fat: 0, grams: 100 },
    { name: 'Dates', icon: '🌴', calories: 282, protein: 2.5, carbs: 75, fat: 0.4, grams: 100 },
    { name: 'Banana', icon: '🍌', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, grams: 118 },
    { name: 'Dark Chocolate', icon: '🍫', calories: 546, protein: 4.9, carbs: 61, fat: 31, grams: 100 },
    { name: 'Energy Bar', icon: '🍫', calories: 250, protein: 10, carbs: 30, fat: 10, grams: 50 },
  ],
  HYDRATION: [
    { name: 'Water', icon: '💧', calories: 0, protein: 0, carbs: 0, fat: 0, grams: 250 },
    { name: 'Coconut Water', icon: '🥥', calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, grams: 100 },
    { name: 'Watermelon', icon: '🍉', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, grams: 100 },
    { name: 'Cucumber', icon: '🥒', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, grams: 100 },
    { name: 'Orange Juice', icon: '🥤', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, grams: 100 },
    { name: 'Green Tea', icon: '🍵', calories: 1, protein: 0, carbs: 0.2, fat: 0, grams: 240 },
  ],
  MICROS: [
    { name: 'Spinach', icon: '🥬', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, grams: 100 },
    { name: 'Broccoli', icon: '🥦', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, grams: 100 },
    { name: 'Blueberry', icon: '🫐', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, grams: 100 },
    { name: 'Carrot', icon: '🥕', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, grams: 100 },
    { name: 'Bell Pepper', icon: '🫑', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, grams: 100 },
    { name: 'Kale', icon: '🥬', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, grams: 100 },
    { name: 'Strawberry', icon: '🍓', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, grams: 100 },
  ]
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nutriguide_profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [suggestion, setSuggestion] = useState<DietSuggestion | null>(null);
  const [dailyLog, setDailyLog] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('nutriguide_log');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showProfileForm, setShowProfileForm] = useState(!profile);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof FOOD_CATEGORIES>('PROTEIN');

  useEffect(() => {
    if (profile) {
      localStorage.setItem('nutriguide_profile', JSON.stringify(profile));
      fetchSuggestions();
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nutriguide_log', JSON.stringify(dailyLog));
  }, [dailyLog]);

  const fetchSuggestions = async () => {
    if (!profile) return;
    try {
      const data = await getPersonalizedSuggestions(profile);
      setSuggestion(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const quickAdd = (food: any) => {
    const newItem: FoodItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSizeGrams: food.grams,
      icon: food.icon
    };
    setDailyLog(prev => [newItem, ...prev]);
  };

  const removeFood = (id: string) => {
    setDailyLog(prev => prev.filter(item => item.id !== id));
  };

  const totalCalories = dailyLog.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = dailyLog.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = dailyLog.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = dailyLog.reduce((sum, item) => sum + item.fat, 0);

  if (showProfileForm) {
    return (
      <ProfileForm 
        initialProfile={profile} 
        onSave={(p) => {
          setProfile(p);
          setShowProfileForm(false);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 glass px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowProfileForm(true)}
            className="p-2 hover:bg-white/5 rounded-2xl transition-colors text-zinc-500 hover:text-zinc-100 flex items-center gap-2"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Profile</span>
          </button>
        </div>

        <div className="text-center absolute left-1/2 -translate-x-1/2 w-full max-w-[60%] pointer-events-none">
          <h1 className="text-lg font-black tracking-tight text-zinc-100 leading-none truncate">TrakCalc</h1>
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1 truncate">Precision nutrition, simplified.</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSuggestion(true)}
            className="p-2 hover:bg-white/5 rounded-2xl transition-colors text-zinc-500 hover:text-zinc-100"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 space-y-12 sm:space-y-16">
        {/* Daily Progress Dashboard */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Daily Dashboard</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-zinc-600" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="warm-card p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Calorie Progress */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full lg:w-auto">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="12" />
                  {profile?.goal !== 'none' && (
                    <motion.circle 
                      cx="50%" cy="50%" r="45%" 
                      className="stroke-emerald-500 fill-none" 
                      strokeWidth="12"
                      strokeDasharray="282.7"
                      initial={{ strokeDashoffset: 282.7 }}
                      animate={{ strokeDashoffset: 282.7 - (282.7 * Math.min(totalCalories / (suggestion?.caloriesTarget || 2000), 1)) }}
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.2))' }}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-100 leading-none">{Math.round(totalCalories)}</span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2">kcal</span>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">
                  {profile?.goal === 'none' ? 'Total Consumed' : 'Remaining'}
                </span>
                <span className="text-4xl sm:text-5xl font-black text-zinc-100 tracking-tighter leading-none">
                  {profile?.goal === 'none' 
                    ? Math.round(totalCalories)
                    : Math.max((suggestion?.caloriesTarget || 2000) - Math.round(totalCalories), 0)
                  }
                </span>
                {profile?.goal !== 'none' && (
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target: {suggestion?.caloriesTarget || 2000} kcal</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px h-20 bg-white/5" />

            {/* Macros Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 w-full">
              <CompactMacroStat 
                label="Protein" 
                value={totalProtein} 
                target={suggestion?.macrosTarget.protein || 150} 
                color="bg-emerald-500" 
                showGoal={profile?.goal !== 'none'}
              />
              <CompactMacroStat 
                label="Carbs" 
                value={totalCarbs} 
                target={suggestion?.macrosTarget.carbs || 250} 
                color="bg-orange-500" 
                showGoal={profile?.goal !== 'none'}
              />
              <CompactMacroStat 
                label="Fat" 
                value={totalFat} 
                target={suggestion?.macrosTarget.fat || 70} 
                color="bg-amber-500" 
                showGoal={profile?.goal !== 'none'}
              />
            </div>
          </div>
        </motion.section>

        {/* Food Log - Moved below dashboard */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Today's Journey</h3>
            {dailyLog.length > 0 && (
              <button 
                onClick={() => setDailyLog([])}
                className="text-[10px] font-black text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                Clear Journey
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence initial={false} mode="popLayout">
              {dailyLog.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="sm:col-span-2 lg:col-span-3 text-center py-12 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5"
                >
                  <p className="text-zinc-500 font-medium text-sm">Your plate is empty. Tap a food icon below.</p>
                </motion.div>
              ) : (
                dailyLog.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#141414] p-4 rounded-2xl border border-white/5 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                        {item.icon || '🍽️'}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 text-sm leading-tight">{item.name}</h4>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{item.calories} kcal</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFood(item.id)}
                      className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Plus Sign in the Middle */}
        <div className="flex justify-center relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const element = document.getElementById('food-categories');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-600/40 border-4 border-[#0A0A0A] -my-8 z-10"
          >
            <Plus className="text-white w-8 h-8" />
          </motion.button>
        </div>

        {/* Interactive Food Categories */}
        <div id="food-categories" className="space-y-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar px-2">
            {[
              { id: 'PROTEIN', label: 'Protein', icon: '🍗', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { id: 'CARBS', label: 'Carbs', icon: '🍚', color: 'text-orange-500', bg: 'bg-orange-500/10' },
              { id: 'FAT', label: 'Fat', icon: '🥑', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { id: 'ENERGY', label: 'Energy', icon: '⚡', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              { id: 'HYDRATION', label: 'Hydration', icon: '💧', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { id: 'MICROS', label: 'Micros', icon: '🥦', color: 'text-lime-500', bg: 'bg-lime-500/10' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border transition-all whitespace-nowrap",
                  selectedCategory === cat.id 
                    ? cn("border-transparent shadow-lg", cat.bg, cat.color) 
                    : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10"
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <FoodCategorySection 
                title={selectedCategory.charAt(0) + selectedCategory.slice(1).toLowerCase()} 
                subtitle={`Essential ${selectedCategory.toLowerCase()} for your blueprint`} 
                foods={FOOD_CATEGORIES[selectedCategory]} 
                onAdd={quickAdd} 
                accentColor={
                  selectedCategory === 'PROTEIN' ? 'text-emerald-500' :
                  selectedCategory === 'CARBS' ? 'text-orange-500' :
                  selectedCategory === 'FAT' ? 'text-amber-500' :
                  selectedCategory === 'ENERGY' ? 'text-yellow-500' :
                  selectedCategory === 'HYDRATION' ? 'text-blue-500' :
                  'text-lime-500'
                }
                bgColor={
                  selectedCategory === 'PROTEIN' ? 'bg-emerald-500' :
                  selectedCategory === 'CARBS' ? 'bg-orange-500' :
                  selectedCategory === 'FAT' ? 'bg-amber-500' :
                  selectedCategory === 'ENERGY' ? 'bg-yellow-500' :
                  selectedCategory === 'HYDRATION' ? 'bg-blue-500' :
                  'bg-lime-500'
                }
                delay={0}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Suggestion Modal */}
      <AnimatePresence>
        {showSuggestion && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuggestion(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: '100%', scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#141414] rounded-[3rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] border border-white/5"
            >
              <button 
                onClick={() => setShowSuggestion(false)}
                className="absolute right-10 top-10 p-3 hover:bg-white/5 rounded-full transition-colors text-zinc-500"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="p-6 bg-emerald-600 rounded-[2rem] shadow-xl shadow-emerald-600/20">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-100">Personalize My Journey</h2>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">AI-Powered Nutrition Blueprint</p>
                  </div>
                </div>

                {/* Quick Stats Edit */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Scale className="w-3 h-3" /> Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      value={profile?.weight}
                      onChange={e => setProfile(prev => prev ? {...prev, weight: parseFloat(e.target.value)} : null)}
                      className="w-full bg-transparent text-2xl font-black text-zinc-100 outline-none"
                    />
                  </div>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Ruler className="w-3 h-3" /> Height (cm)
                    </label>
                    <input 
                      type="number" 
                      value={profile?.height}
                      onChange={e => setProfile(prev => prev ? {...prev, height: parseFloat(e.target.value)} : null)}
                      className="w-full bg-transparent text-2xl font-black text-zinc-100 outline-none"
                    />
                  </div>
                </div>

                {/* BMI Status */}
                {profile && (
                  <div className="bg-emerald-500/5 p-8 rounded-[2rem] border border-emerald-500/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Your BMI</span>
                      <span className="text-4xl font-black text-emerald-400 tracking-tighter">
                        {(profile.weight / ((profile.height / 100) ** 2)).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Status</span>
                      <span className="text-lg font-black text-zinc-100">
                        {(() => {
                          const bmi = profile.weight / ((profile.height / 100) ** 2);
                          if (bmi < 18.5) return 'Underweight';
                          if (bmi < 25) return 'Healthy';
                          if (bmi < 30) return 'Overweight';
                          return 'Obese';
                        })()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Goal Selection */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Current Goal</span>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'cut', label: 'Cut', icon: '📉' },
                      { id: 'regular', label: 'Regular', icon: '⚖️' },
                      { id: 'bulk', label: 'Bulk', icon: '💪' }
                    ].map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => setProfile(prev => prev ? {...prev, goal: goal.id as any} : null)}
                        className={cn(
                          "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2",
                          profile?.goal === goal.id 
                            ? "bg-emerald-500/10 border-emerald-600" 
                            : "bg-white/5 border-transparent"
                        )}
                      >
                        <span className="text-2xl">{goal.icon}</span>
                        <span className={cn("text-xs font-black uppercase tracking-widest", profile?.goal === goal.id ? "text-emerald-400" : "text-zinc-500")}>
                          {goal.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {suggestion ? (
                  <div className="space-y-10 pt-6 border-t border-white/5">
                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 shadow-sm">
                      <h3 className="text-2xl font-black text-zinc-100 mb-4 tracking-tight">{suggestion.title}</h3>
                      <p className="text-zinc-400 leading-relaxed font-medium text-lg">
                        {suggestion.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                        <span className="text-[10px] font-black text-zinc-500 uppercase block mb-3 tracking-widest">Daily Target</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-zinc-100 tracking-tighter">{suggestion.caloriesTarget}</span>
                          <span className="text-xs font-bold text-zinc-500">kcal</span>
                        </div>
                      </div>
                      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                        <span className="text-[10px] font-black text-zinc-500 uppercase block mb-3 tracking-widest">Protein Goal</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-zinc-100 tracking-tighter">{suggestion.macrosTarget.protein}</span>
                          <span className="text-xs font-bold text-zinc-500">g</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowSuggestion(false)}
                      className="w-full bg-emerald-600 text-white font-black py-6 rounded-[2rem] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] text-xl"
                    >
                      Embrace the Plan
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-20 space-y-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    >
                      <Activity className="w-20 h-20 text-emerald-600" />
                    </motion.div>
                    <p className="text-zinc-500 font-black text-xl tracking-tight">Crafting your blueprint...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FoodCategorySection({ title, subtitle, foods, onAdd, accentColor, bgColor, delay }: any) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="space-y-8"
    >
      <div className="flex flex-col px-2">
        <h2 className={cn("text-3xl font-black tracking-tight", accentColor)}>{title}</h2>
        <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">{subtitle}</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-5">
        {foods.map((food: any) => (
          <motion.button
            key={food.name}
            whileHover={{ scale: 1.1, y: -8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAdd(food)}
            className="flex flex-col items-center gap-2 sm:gap-4 p-3 sm:p-5 bg-[#141414] rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 shadow-sm hover:border-white/10 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", bgColor)} />
            <span className="text-4xl group-hover:scale-110 transition-transform z-10">{food.icon}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter z-10 text-center leading-none group-hover:text-zinc-100 transition-colors">{food.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

function CompactMacroStat({ label, value, target, color, showGoal = true }: { label: string, value: number, target: number, color: string, showGoal?: boolean }) {
  const percentage = Math.min((value / target) * 100, 100);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-xs font-black text-zinc-100">{Math.round(value)}g</span>
      </div>
      {showGoal && (
        <>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className={cn("h-full rounded-full shadow-sm", color)}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Goal: {target}g</span>
          </div>
        </>
      )}
    </div>
  );
}

function ProfileForm({ initialProfile, onSave }: { initialProfile: UserProfile | null, onSave: (p: UserProfile) => void }) {
  const [formData, setFormData] = useState<UserProfile>(initialProfile || {
    age: 25,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    goal: 'regular'
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 sm:px-8 py-10 sm:py-20 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-[#141414] rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-16 shadow-2xl border border-white/5 space-y-12"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-600 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 sm:mb-10 shadow-2xl shadow-emerald-600/30">
            <Activity className="text-white w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-100">Your TrakCalc</h1>
          <p className="text-zinc-500 font-medium text-lg sm:text-xl max-w-md mx-auto">Let's craft a nutrition blueprint as unique as you are.</p>
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <Calendar className="w-4 h-4" /> Age
              </label>
              <input 
                type="number" 
                value={formData.age}
                onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full bg-white/5 border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 focus:bg-white/10 focus:border-emerald-600 outline-none transition-all font-black text-lg sm:text-xl text-zinc-100"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <User className="w-4 h-4" /> Gender
              </label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
                className="w-full bg-white/5 border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 focus:bg-white/10 focus:border-emerald-600 outline-none transition-all font-black text-lg sm:text-xl appearance-none text-zinc-100"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <Scale className="w-4 h-4" /> Weight (kg)
              </label>
              <input 
                type="number" 
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                className="w-full bg-white/5 border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 focus:bg-white/10 focus:border-emerald-600 outline-none transition-all font-black text-lg sm:text-xl text-zinc-100"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <Ruler className="w-4 h-4" /> Height (cm)
              </label>
              <input 
                type="number" 
                value={formData.height}
                onChange={e => setFormData({...formData, height: parseFloat(e.target.value)})}
                className="w-full bg-white/5 border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 focus:bg-white/10 focus:border-emerald-600 outline-none transition-all font-black text-lg sm:text-xl text-zinc-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Activity className="w-4 h-4" /> Activity Level
            </label>
            <select 
              value={formData.activityLevel}
              onChange={e => setFormData({...formData, activityLevel: e.target.value as any})}
              className="w-full bg-white/5 border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 focus:bg-white/10 focus:border-emerald-600 outline-none transition-all font-black text-lg sm:text-xl appearance-none text-zinc-100"
            >
              <option value="sedentary">Sedentary (Office job)</option>
              <option value="light">Lightly Active (1-3 days/week)</option>
              <option value="moderate">Moderately Active (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="very_active">Very Active (Physical job)</option>
            </select>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Target className="w-4 h-4" /> Your Aspiration
            </label>
                <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'cut', label: 'Cut', icon: '📉', desc: 'Burn fat & get lean' },
                { id: 'regular', label: 'Regular', icon: '⚖️', desc: 'Stay healthy & balanced' },
                { id: 'bulk', label: 'Bulk', icon: '💪', desc: 'Build strength & mass' },
                { id: 'none', label: 'None', icon: '📝', desc: 'Just tracking, no goal' }
              ].map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setFormData({...formData, goal: goal.id as any})}
                  className={cn(
                    "flex items-center justify-between p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all text-left group",
                    formData.goal === goal.id 
                      ? "bg-emerald-500/10 border-emerald-600 shadow-xl shadow-emerald-600/10" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-3xl sm:text-4xl">{goal.icon}</span>
                    <div>
                      <span className={cn("text-lg sm:text-xl font-black block", formData.goal === goal.id ? "text-emerald-400" : "text-zinc-100")}>{goal.label}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest">{goal.desc}</span>
                    </div>
                  </div>
                  <div className={cn("w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all", 
                    formData.goal === goal.id ? "border-emerald-600 bg-emerald-600" : "border-zinc-700")}>
                    {formData.goal === goal.id && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onSave(formData)}
            className="w-full bg-emerald-600 text-white font-black py-6 sm:py-8 rounded-[1.5rem] sm:rounded-[2.5rem] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 active:scale-[0.98] text-xl sm:text-2xl tracking-tight mt-6"
          >
            BEGIN MY JOURNEY
          </button>
        </div>
      </motion.div>
    </div>
  );
}
