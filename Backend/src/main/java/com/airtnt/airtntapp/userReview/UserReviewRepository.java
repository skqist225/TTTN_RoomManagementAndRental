package com.airtnt.airtntapp.userReview;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.UserReview;

@Repository
public interface UserReviewRepository extends CrudRepository<UserReview, Integer> {

}
