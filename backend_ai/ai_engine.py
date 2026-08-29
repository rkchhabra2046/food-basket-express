import pandas as pd
import numpy as np
import re

class FoodBasketAIEngine:
    def __init__(self):
        # Create Pandas DataFrame with food menu items & nutritional macro data
        items_data = [
            { "id": 101, "name": "Double Cheese Margherita Burger", "price": 180.0, "category": "Burgers", "imageUrl": "burger.png", "isVeg": True, "calories": 420, "protein": 18, "carbs": 45, "fat": 20, "desc": "Double layered melted mozzarella with fresh lettuce and herbs." },
            { "id": 102, "name": "Double Patty Crispy Paneer Burger", "price": 220.0, "category": "Burgers", "imageUrl": "burger.png", "isVeg": True, "calories": 510, "protein": 24, "carbs": 52, "fat": 26, "desc": "Two golden fried paneer patties with spicy mayo and jalapeños." },
            { "id": 1, "name": "Double Beef Burger", "price": 250.0, "category": "Burgers", "imageUrl": "burger.png", "isVeg": False, "calories": 650, "protein": 38, "carbs": 48, "fat": 34, "desc": "Juicy double beef patty with melted cheddar." },
            { "id": 2, "name": "Veggie Supreme Pizza", "price": 300.0, "category": "Pizzas", "imageUrl": "pizza.png", "isVeg": True, "calories": 580, "protein": 20, "carbs": 72, "fat": 22, "desc": "Fresh mozzarella topped with crisp peppers and olives." },
            { "id": 103, "name": "Cheese Burst Veggie Supreme Pizza", "price": 380.0, "category": "Pizzas", "imageUrl": "pizza.png", "isVeg": True, "calories": 720, "protein": 26, "carbs": 78, "fat": 32, "desc": "Loaded with liquid cheese in crust, bell peppers, corn, and mushrooms." },
            { "id": 104, "name": "Gourmet Paneer Tikka Pizza", "price": 420.0, "category": "Pizzas", "imageUrl": "pizza.png", "isVeg": True, "calories": 680, "protein": 28, "carbs": 70, "fat": 30, "desc": "Tandoori paneer tikka, red onions, coriander, and mint swirl." },
            { "id": 105, "name": "Peri Peri Chicken Pizza", "price": 490.0, "category": "Pizzas", "imageUrl": "pizza.png", "isVeg": False, "calories": 760, "protein": 42, "carbs": 68, "fat": 36, "desc": "Fiery peri-peri chicken chunks with charred onions and jalapeños." },
            { "id": 3, "name": "Fried Chicken Bucket", "price": 700.0, "category": "Chicken", "imageUrl": "fried-chicken.png", "isVeg": False, "calories": 920, "protein": 64, "carbs": 35, "fat": 58, "desc": "Golden crispy fried chicken 8-piece bucket." },
            { "id": 4, "name": "Chicken Kathi Roll", "price": 550.0, "category": "Rolls", "imageUrl": "chicken-roll.png", "isVeg": False, "calories": 480, "protein": 32, "carbs": 42, "fat": 18, "desc": "Spicy kathi roll filled with tender tandoori chicken." },
            { "id": 106, "name": "Crispy Masala Dosa with Sambar", "price": 150.0, "category": "Snacks", "imageUrl": "dosa.png", "isVeg": True, "calories": 320, "protein": 8, "carbs": 58, "fat": 8, "desc": "Golden thin crepe stuffed with spiced potato masala, served with coconut chutney & piping hot sambar." },
            { "id": 107, "name": "Authentic Delhi Gol Gappe (8 Pcs)", "price": 80.0, "category": "Snacks", "imageUrl": "golgappe.png", "isVeg": True, "calories": 180, "protein": 4, "carbs": 34, "fat": 4, "desc": "Crispy puris filled with spicy tangy mint jal-jeera water and potatoes." },
            { "id": 108, "name": "Fluffy South Indian Idli Sambar (4 Pcs)", "price": 120.0, "category": "Snacks", "imageUrl": "idli.png", "isVeg": True, "calories": 240, "protein": 9, "carbs": 48, "fat": 2, "desc": "Soft steamed rice idlis served with authentic dal sambar & coconut dip." },
            { "id": 9, "name": "Crispy Samosa", "price": 25.0, "category": "Snacks", "imageUrl": "Samosa.png", "isVeg": True, "calories": 160, "protein": 4, "carbs": 24, "fat": 7, "desc": "Crispy Indian spiced potato pastry." },
            { "id": 8, "name": "Crispy Spring Roll", "price": 800.0, "category": "Snacks", "imageUrl": "spring-roll.png", "isVeg": True, "calories": 380, "protein": 10, "carbs": 44, "fat": 18, "desc": "Crispy fried vegetable spring rolls." },
            { "id": 5, "name": "Sub Veggie Sandwich", "price": 500.0, "category": "Sandwiches", "imageUrl": "sandwich.png", "isVeg": True, "calories": 340, "protein": 12, "carbs": 54, "fat": 10, "desc": "Fresh footlong loaded sub sandwich." },
            { "id": 6, "name": "Chicken Lasagna", "price": 1200.0, "category": "Italian", "imageUrl": "lasagna.png", "isVeg": False, "calories": 810, "protein": 45, "carbs": 62, "fat": 42, "desc": "Classic Italian layered pasta dish." },
            { "id": 7, "name": "Italian Spaghetti", "price": 580.0, "category": "Italian", "imageUrl": "spaghetti.png", "isVeg": False, "calories": 620, "protein": 28, "carbs": 74, "fat": 22, "desc": "Spaghetti Bolognese with parmesan." }
        ]

        self.df = pd.DataFrame(items_data)

    def process_query(self, user_text):
        query = user_text.lower().strip()

        # 1. Budget extraction via regex
        budget_match = re.search(r'(?:under|below|less than|budget|₹|\$)\s*(\d+)', query)
        max_budget = float(budget_match.group(1)) if budget_match else None

        # 2. Diet preference
        is_veg_req = None
        if "pure veg" in query or "veg" in query and "non-veg" not in query and "non veg" not in query:
            is_veg_req = True
        elif "non-veg" in query or "non veg" in query or "chicken" in query or "beef" in query:
            is_veg_req = False

        # Filter DataFrame using Pandas Boolean Indexing
        filtered_df = self.df.copy()

        if is_veg_req is not None:
            filtered_df = filtered_df[filtered_df['isVeg'] == is_veg_req]

        if max_budget is not None:
            filtered_df = filtered_df[filtered_df['price'] <= max_budget]

        # NumPy score ranking based on relevance
        scores = np.zeros(len(filtered_df))

        keywords = ["burger", "pizza", "dosa", "gol gappe", "idli", "samosa", "roll", "chicken", "sandwich", "lasagna", "spaghetti", "snack", "cheese", "spicy"]

        for idx, (_, row) in enumerate(filtered_df.iterrows()):
            item_text = f"{row['name']} {row['category']} {row['desc']}".lower()
            match_count = sum(1 for kw in keywords if kw in query and kw in item_text)
            scores[idx] += match_count * 2.5

            if "cheap" in query or "affordable" in query or "budget" in query:
                scores[idx] += (1000 - row['price']) / 100

            if "protein" in query or "fitness" in query:
                scores[idx] += row['protein'] * 0.5

            if "low calorie" in query or "light" in query:
                scores[idx] += (1000 - row['calories']) / 100

        # Sort recommendations using NumPy argsort
        if len(scores) > 0 and scores.max() > 0:
            top_indices = np.argsort(scores)[::-1][:4]
            recommended_df = filtered_df.iloc[top_indices]
        else:
            recommended_df = filtered_df.head(4)

        recommendations = recommended_df.to_dict(orient='records')

        # Generate conversational response
        bot_reply = self.generate_response_text(user_text, len(recommendations), max_budget, is_veg_req)

        return {
            "reply": bot_reply,
            "recommendations": recommendations,
            "total_matches": len(filtered_df)
        }

    def generate_response_text(self, text, count, budget, is_veg):
        if "hello" in text or "hi" in text or "hey" in text:
            return "Hello! I am your AI Foodie Assistant powered by Python, Pandas & NumPy. What food craving can I help you find today?"
        
        diet_str = "🟢 Pure Veg" if is_veg is True else ("🔴 Non-Veg" if is_veg is False else "Gourmet")
        budget_str = f" under ₹{int(budget)}" if budget else ""

        if count > 0:
            return f"Here are the best top-rated {diet_str} options{budget_str} calculated dynamically using Python Pandas & NumPy scoring:"
        else:
            return f"I couldn't find exact matches for your request{budget_str}. Here are our top gourmet specials you might love:"

ai_engine = FoodBasketAIEngine()
