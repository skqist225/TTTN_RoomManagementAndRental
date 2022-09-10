package com.airtnt.airtntapp.user;

import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.exception.VerifiedUserException;
import com.airtnt.airtntapp.user.dto.CountUserByRole;
import com.airtnt.airtntapp.user.dto.UserListDTO;
import com.airtnt.airtntapp.user.dto.UserListResponse;
import com.airtnt.entity.Role;
import com.airtnt.entity.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    public static final int USERS_PER_PAGE = 10;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager;

    public UserListResponse getAllUsers(Map<String, String> filters, int page) {
        String searchQuery = filters.get("query");
        String roles = filters.get("roles");
        String statuses = filters.get("statuses");

        Sort sort = Sort.by("id").descending();
        Pageable pageable = PageRequest.of(page - 1, USERS_PER_PAGE, sort);

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
        Root<User> root = criteriaQuery.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        Expression<String> userId = root.get("id");
        Expression<String> firstName = root.get("firstName");
        Expression<String> lastName = root.get("lastName");
        Expression<String> sex = root.get("sex");
        Expression<String> roleName = root.get("role").get("name");
        Expression<Boolean> status = root.get("status");

        if (!StringUtils.isEmpty(searchQuery)) {
            Expression<String> wantedQueryField = criteriaBuilder.concat(userId, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, firstName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, lastName);
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, " ");
            wantedQueryField = criteriaBuilder.concat(wantedQueryField, sex);

            predicates.add(criteriaBuilder.and(criteriaBuilder.like(wantedQueryField, "%" + searchQuery + "%")));
        }

        List<String> userRoles = new ArrayList<>();
        if (roles.split(",").length > 0) {
            for (String role : roles.split(",")) {
                if (Objects.equals(role, "User")) {
                    userRoles.add("User");
                } else if (Objects.equals(role, "Host")) {
                    userRoles.add("Host");
                } else {
                    userRoles.add("Admin");
                }
            }
        }

        if (userRoles.size() > 0) {
            predicates.add(criteriaBuilder.and(roleName.in(userRoles)));
        }

        List<Boolean> statusesID = new ArrayList<>();
        if (statuses.split(",").length > 0) {
            for (String statuss : statuses.split(",")) {
                if (Objects.equals(statuss, "1")) {
                    statusesID.add(true);
                } else {
                    statusesID.add(false);
                }
            }
        }

        if (statusesID.size() > 0) {
            predicates.add(criteriaBuilder.and(status.in(statusesID)));
        }

        criteriaQuery
                .where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])))
                .orderBy(criteriaBuilder.desc(root.get("id")));

        TypedQuery<User> typedQuery = entityManager.createQuery(criteriaQuery);
        int totalRows = typedQuery.getResultList().size();
        typedQuery.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        typedQuery.setMaxResults(pageable.getPageSize());

        Page<User> result = new PageImpl<>(typedQuery.getResultList(), pageable, totalRows);

        List<UserListDTO> userListDTOS = new ArrayList<>();
        for (User b : result.getContent()) {
            userListDTOS.add(UserListDTO.build(b));
        }

        return new UserListResponse(userListDTOS, result.getTotalElements(), result.getTotalPages());
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
