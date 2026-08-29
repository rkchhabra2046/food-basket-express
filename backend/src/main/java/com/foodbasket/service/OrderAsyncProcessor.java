package com.foodbasket.service;

import com.foodbasket.model.Order;
import com.foodbasket.model.OrderStatus;
import com.foodbasket.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class OrderAsyncProcessor {

    private static final Logger logger = LoggerFactory.getLogger(OrderAsyncProcessor.class);

    @Autowired
    private OrderRepository orderRepository;

    @Async("orderTaskExecutor")
    public void processOrderConcurrently(Long orderId) {
        logger.info("[THREAD {}] Starting concurrent processing for Order ID: {}", Thread.currentThread().getName(), orderId);

        try {
            // Stage 1: Order Validation & Kitchen Dispatch
            Thread.sleep(5000);
            updateStatus(orderId, OrderStatus.PREPARING);
            logger.info("[THREAD {}] Order ID {} updated to PREPARING", Thread.currentThread().getName(), orderId);

            // Stage 2: Food Preparation Completed & Out for Delivery
            Thread.sleep(10000);
            updateStatus(orderId, OrderStatus.OUT_FOR_DELIVERY);
            logger.info("[THREAD {}] Order ID {} updated to OUT_FOR_DELIVERY", Thread.currentThread().getName(), orderId);

            // Stage 3: Delivery Completed
            Thread.sleep(15000);
            updateStatus(orderId, OrderStatus.DELIVERED);
            logger.info("[THREAD {}] Order ID {} completed and marked DELIVERED", Thread.currentThread().getName(), orderId);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("[THREAD {}] Multithreaded processing interrupted for Order ID: {}", Thread.currentThread().getName(), orderId);
        }
    }

    private void updateStatus(Long orderId, OrderStatus status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            // Only progress if not rejected or cancelled
            if (order.getStatus() != OrderStatus.REJECTED && order.getStatus() != OrderStatus.CANCELLED) {
                order.setStatus(status);
                orderRepository.save(order);
            }
        });
    }
}
