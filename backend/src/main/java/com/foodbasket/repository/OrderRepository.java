package com.foodbasket.repository;

import com.foodbasket.model.Order;
import com.foodbasket.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}
