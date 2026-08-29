package com.foodbasket.service;

import com.foodbasket.model.FoodItem;
import com.foodbasket.model.Restaurant;
import com.foodbasket.repository.FoodItemRepository;
import com.foodbasket.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    public List<FoodItem> getFoodItemsByRestaurant(Long restaurantId) {
        return foodItemRepository.findByRestaurantId(restaurantId);
    }

    public FoodItem getFoodItemById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
    }

    public FoodItem addFoodItem(FoodItem foodItem, Long restaurantId) {
        if (restaurantId != null) {
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElse(null);
            foodItem.setRestaurant(restaurant);
        }
        return foodItemRepository.save(foodItem);
    }

    public FoodItem updatePrice(Long id, Double newPrice) {
        FoodItem item = getFoodItemById(id);
        item.setPrice(newPrice);
        return foodItemRepository.save(item);
    }

    public FoodItem toggleAvailability(Long id, Boolean isAvailable) {
        FoodItem item = getFoodItemById(id);
        item.setIsAvailable(isAvailable);
        return foodItemRepository.save(item);
    }

    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }
}
