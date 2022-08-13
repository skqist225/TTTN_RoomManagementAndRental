package com.airtnt.airtntapp.review;

import java.util.List;

import com.airtnt.entity.Review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getReviewsByBookings(List<Integer> bookingIds) {
        return reviewRepository.getReviewsByBookings(bookingIds);
    }

    public List<Review> getReviewsByBookings(Integer[] bookingIds, double numberOfStars) {
        return numberOfStars == 0 ? reviewRepository.getAllReviewsByBookings(bookingIds, numberOfStars)
                : reviewRepository.getReviewsByBookingsAndNumberOfStars(bookingIds, numberOfStars);
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public Review updateReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviewByIdRoom(int id) {
        return reviewRepository.getReviewByIdRoom(id);
    }

    // public Integer getTotalRatingByIdRoom(Integer id) {
    //     return reviewRepository.getTotalRatingByIdRoom(id);
    // }
}
