package com.foodbasket.service;

import com.foodbasket.model.Review;
import com.foodbasket.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review addReview(Review review) {
        if (review.getCustomerAvatar() == null || review.getCustomerAvatar().isEmpty()) {
            review.setCustomerAvatar("profile1.jpeg");
        }
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, Review updated) {
        Optional<Review> optional = reviewRepository.findById(id);
        if (optional.isPresent()) {
            Review existing = optional.get();
            existing.setCustomerName(updated.getCustomerName());
            existing.setCustomerAvatar(updated.getCustomerAvatar());
            existing.setRating(updated.getRating());
            existing.setComment(updated.getComment());
            existing.setFoodItemName(updated.getFoodItemName());
            return reviewRepository.save(existing);
        }
        return reviewRepository.save(updated);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
