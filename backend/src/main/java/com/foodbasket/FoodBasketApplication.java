package com.foodbasket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FoodBasketApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodBasketApplication.class, args);
    }
}
