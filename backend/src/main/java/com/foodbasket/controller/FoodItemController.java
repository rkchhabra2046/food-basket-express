package com.foodbasket.controller;

import com.foodbasket.model.FoodItem;
import com.foodbasket.service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food-items")
@CrossOrigin(origins = "*")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems(@RequestParam(required = false) Long restaurantId) {
        if (restaurantId != null) {
            return ResponseEntity.ok(foodItemService.getFoodItemsByRestaurant(restaurantId));
        }
        return ResponseEntity.ok(foodItemService.getAllFoodItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodItemById(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.getFoodItemById(id));
    }

    @PostMapping
    public ResponseEntity<FoodItem> addFoodItem(@RequestBody Map<String, Object> body) {
        FoodItem item = new FoodItem();
        item.setName((String) body.get("name"));
        item.setDescription((String) body.get("description"));
        item.setPrice(Double.valueOf(body.get("price").toString()));
        item.setCategory((String) body.get("category"));
        item.setImageUrl((String) body.get("imageUrl"));
        
        Long restaurantId = body.containsKey("restaurantId") && body.get("restaurantId") != null 
                ? Long.valueOf(body.get("restaurantId").toString()) : null;

        return ResponseEntity.ok(foodItemService.addFoodItem(item, restaurantId));
    }

    @PutMapping("/{id}/price")
    public ResponseEntity<FoodItem> updatePrice(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Double newPrice = Double.valueOf(body.get("price").toString());
        return ResponseEntity.ok(foodItemService.updatePrice(id, newPrice));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<FoodItem> toggleAvailability(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Boolean isAvailable = (Boolean) body.get("isAvailable");
        return ResponseEntity.ok(foodItemService.toggleAvailability(id, isAvailable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Food item deleted successfully");
        return ResponseEntity.ok(response);
    }
}
