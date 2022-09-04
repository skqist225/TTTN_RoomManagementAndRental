package com.airtnt.airtntapp.user;

import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.exception.VerifiedUserException;
import com.airtnt.airtntapp.user.dto.CountUserByRole;
import com.airtnt.entity.Role;
import com.airtnt.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    public static final int USERS_PER_PAGE = 10;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<User> getAllUsers(int pageNumber, String keyword) {
        Pageable pageable = PageRequest.of(pageNumber - 1, USERS_PER_PAGE);
        return userRepository.findAll(keyword, pageable);
    }

    public void encodePassword(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
    }

    public String getEncodedPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean isPasswordMatch(String rawPass, String hashPass) {
        return passwordEncoder.matches(rawPass, hashPass);
    }

    public User findByEmail(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return user;
    }

    public boolean checkPhoneNumber(String phoneNumber, Boolean isEdit, Integer userId) {
        if (!isEdit) {
            Optional<User> user = userRepository.findByPhoneNumber(phoneNumber);
            return user.isPresent();
        } else {
            return userRepository.findByPhoneNumberAndId(phoneNumber, userId).size() > 0;
        }
    }

    public boolean checkEmail(String email, Boolean isEdit, Integer userId) {
        if (!isEdit) {
            Optional<User> user = userRepository.findByEmail(email);
            return user.isPresent();
        } else {
            return userRepository.findByEmailAndId(email, userId).size() > 0;
        }
    }

    public boolean checkBirthday(LocalDate birthday) {
        int period = Period.between(birthday, LocalDate.now()).getYears();
        return period < 18;
    }

    public User findByPhoneNumber(String phoneNumber) throws UserNotFoundException {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new UserNotFoundException("User not found with phone number: " + phoneNumber));
        return user;
    }

    public CountUserByRole countUserByRole() {
        return new CountUserByRole(userRepository.countUserByRole(1), userRepository.countUserByRole(2), userRepository.countUserByRole(3));
    }

    @Transactional
    public int verifyPhoneNumber(Integer userId) {
        return userRepository.verifyPhoneNumber(userId);
    }


    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User save(User user){
        boolean isUpdatingUser = (user.getId() != null);
        if (isUpdatingUser) {
            User existingUser = userRepository.findById(user.getId()).get();

            if (user.getPassword().isEmpty()) {
                user.setPassword(existingUser.getPassword());
            } else {
                encodePassword(user);
            }
        } else {
            // 2 is User
            user.setRole(new Role(2));
            encodePassword(user);
        }

        return userRepository.save(user);
    }

    public String deleteById(Integer id)
            throws UserNotFoundException, VerifiedUserException {
        try {
            userRepository.deleteById(id);
            return "Delete user successfully";
        } catch (Exception ex) {
            return "Could not delete this user as constraint exception";
        }
    }

    public User findById(Integer id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return user;
    }

    @Transactional
    public void removeFromFavLists(Integer userId, Integer roomId) {
        userRepository.removeFromFavLists(userId,roomId);
    }

    public Integer getNumberOfUser() {
        return userRepository.getNumberOfUser();
    }
}
