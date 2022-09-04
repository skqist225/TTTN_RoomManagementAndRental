package com.airtnt.airtntapp.review;

import com.airtnt.entity.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Integer> {

    @Query("SELECT r FROM Review r WHERE r.bookingDetail.id IN (:bookingIds) AND (r.subRating.cleanliness + r.subRating.contact + r.subRating.checkin + r.subRating.accuracy + r.subRating.location + r.subRating.value) / 6.0 = :numberOfStars")
    public List<Review> getReviewsByBookingsAndNumberOfStars(List<Integer> bookingIds, double numberOfStars);

    @Query("SELECT r FROM Review r WHERE r.bookingDetail.id IN (:bookingIds) AND (r.subRating.cleanliness + r.subRating.contact + r.subRating.checkin + r.subRating.accuracy + r.subRating.location + r.subRating.value) / 6.0 >= :numberOfStars")
    public List<Review> getAllReviewsByBookings(List<Integer> bookingIds, double numberOfStars);

    @Query("SELECT r FROM Review r WHERE r.bookingDetail.id IN (:bookingIds)")
    public List<Review> getReviewsByBookings(@Param("bookingIds") List<Integer> bookingIds);

    @Query("SELECT r FROM Review r WHERE r.bookingDetail.room.id = :id")
    public List<Review> getReviewByIdRoom(int id);
}
