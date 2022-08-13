package com.airtnt.airtntapp.review;

import java.util.List;

import com.airtnt.entity.Review;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Integer> {

    @Query("SELECT r FROM Review r WHERE r.booking.id IN (:bookingIds) AND (r.subRating.cleanliness + r.subRating.contact + r.subRating.checkin + r.subRating.accuracy + r.subRating.location + r.subRating.value) / 6.0 = :numberOfStars")
    public List<Review> getReviewsByBookingsAndNumberOfStars(Integer[] bookingIds, double numberOfStars);

    @Query("SELECT r FROM Review r WHERE r.booking.id IN (:bookingIds) AND (r.subRating.cleanliness + r.subRating.contact + r.subRating.checkin + r.subRating.accuracy + r.subRating.location + r.subRating.value) / 6.0 >= :numberOfStars")
    public List<Review> getAllReviewsByBookings(Integer[] bookingIds, double numberOfStars);

    @Query("SELECT r FROM Review r WHERE r.booking.id IN (:bookingIds)")
    public List<Review> getReviewsByBookings(List<Integer> bookingIds);

    @Query("SELECT r FROM Review r WHERE r.booking.room.id = :id")
    public List<Review> getReviewByIdRoom(int id);
}
