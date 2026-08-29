package com.foodbasket.service;

import com.foodbasket.model.*;
import com.foodbasket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private OrderAsyncProcessor orderAsyncProcessor;

    @Transactional
    public Order createOrder(Long userId, Long restaurantId, List<Map<String, Object>> itemsRequest,
                            String deliveryAddress, String contactPhone, String paymentMethod) {

        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Restaurant restaurant = null;
        if (restaurantId != null) {
            restaurant = restaurantRepository.findById(restaurantId).orElse(null);
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(deliveryAddress);
        order.setContactPhone(contactPhone);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(OrderStatus.PENDING);

        double totalAmount = 0.0;

        for (Map<String, Object> itemReq : itemsRequest) {
            Long foodItemId = Long.valueOf(itemReq.get("foodItemId").toString());
            Integer quantity = Integer.valueOf(itemReq.get("quantity").toString());

            FoodItem foodItem = foodItemRepository.findById(foodItemId)
                    .orElseThrow(() -> new RuntimeException("Food item not found with id: " + foodItemId));

            if (!foodItem.getIsAvailable()) {
                throw new RuntimeException("Item '" + foodItem.getName() + "' is currently out of stock!");
            }

            double itemTotal = foodItem.getPrice() * quantity;
            totalAmount += itemTotal;

            OrderItem orderItem = new OrderItem(foodItem, quantity, foodItem.getPrice());
            order.addItem(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Multithreaded Async Processing for Order Lifecycle Simulation
        orderAsyncProcessor.processOrderConcurrently(savedOrder.getId());

        return savedOrder;
    }

    public List<Order> getCustomerOrders(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
