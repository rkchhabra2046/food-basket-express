package com.foodbasket.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private String address;
    private String cuisineType;
    private Double rating;
    private String imageUrl;
    private Boolean isOpen;

    public Restaurant() {
        this.rating = 4.5;
        this.isOpen = true;
    }

    public Restaurant(String name, String description, String address, String cuisineType, Double rating, String imageUrl) {
        this.name = name;
        this.description = description;
        this.address = address;
        this.cuisineType = cuisineType;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.isOpen = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsOpen() { return isOpen; }
    public void setIsOpen(Boolean isOpen) { this.isOpen = isOpen; }
}
