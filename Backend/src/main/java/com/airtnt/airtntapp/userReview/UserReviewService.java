package com.airtnt.airtntapp.userReview;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airtnt.entity.UserReview;

@Service
public class UserReviewService {
    @Autowired
    private UserReviewRepository userReviewRepository;

    public UserReview save(UserReview userReview) {
        return userReviewRepository.save(userReview);
    }
}
