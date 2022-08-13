package com.airtnt.airtntapp.user;

import java.io.IOException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.exception.VerifiedUserException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.user.dto.UpdateUserDTO;
import com.airtnt.airtntapp.user.dto.UserListDTO;
import com.airtnt.airtntapp.user.dto.UserListResponse;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Sex;
import com.airtnt.entity.State;
import com.airtnt.entity.User;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/admin/")
public class AdminUserRestController {
    @Autowired
    private UserService userService;

    @Value("${env}")
    private String environment;

    @GetMapping("users")
    public ResponseEntity<StandardJSONResponse<UserListResponse>> getAllUsers(@RequestParam("page") int pageNumber,
            @RequestParam(value = "keyword", defaultValue = "", required = false) String keyword) {
        Page<User> userPages = userService.getAllUsers(pageNumber, keyword);

        List<UserListDTO> userListDTOs = new ArrayList<>();
        UserListResponse userListResponse = new UserListResponse();

        for (User user : userPages.getContent()) {
            userListDTOs.add(UserListDTO.build(user));
            // redisTemplate.opsForHash().put("ROOM", room.getId().toString(),
            // RoomListingsDTO.buildRoomListingsDTO(room));
        }

        // if (redisTemplate.opsForHash().get("TOTAL_PAGES", "TOTAL_PAGES") != null) {
        // roomListingsDTOs = redisTemplate.opsForHash().values("ROOM");

        // roomsOwnedByUserResponseEntity.setRooms(roomListingsDTOs);
        // roomsOwnedByUserResponseEntity
        // .setTotalPages((int) redisTemplate.opsForHash().get("TOTAL_PAGES",
        // "TOTAL_PAGES"));
        // roomsOwnedByUserResponseEntity
        // .setTotalRecords((long) redisTemplate.opsForHash().get("TOTAL_ELS",
        // "TOTAL_ELS"));
        // } else {

        // redisTemplate.opsForHash().put("TOTAL_PAGES", "TOTAL_PAGES", (Integer)
        // roomsPage.getTotalPages());
        // redisTemplate.opsForHash().put("TOTAL_ELS", "TOTAL_ELS", (Long)
        // roomsPage.getTotalElements());

        userListResponse.setUsers(userListDTOs);
        userListResponse.setTotalPages(userPages.getTotalPages());
        userListResponse.setTotalElements(userPages.getTotalElements());

        return new OkResponse<UserListResponse>(userListResponse).response();
    }

    @GetMapping("users/{id}")
    public ResponseEntity<StandardJSONResponse<User>> getUser(@PathVariable(value = "id") Integer id) {
        try {
            User user = userService.findById(id);

            return new OkResponse<User>(user).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<StandardJSONResponse<Boolean>> deleteUser(@PathVariable(value = "id") Integer id) {
        try {
            userService.deleteUser(id);

            return new OkResponse<Boolean>(true).response();
        } catch (UserNotFoundException | SQLIntegrityConstraintViolationException | VerifiedUserException e) {
            System.out.println(e.getMessage());
            return new BadResponse<Boolean>(e.getMessage()).response();
        }
    }

    @PutMapping("users/{id}/update")
    public ResponseEntity<StandardJSONResponse<User>> updateUser(@PathVariable(value = "id") Integer userId,
            @RequestBody UpdateUserDTO updateUserDTO) throws IOException {
        try {
            User user = userService.findById(userId);

            user.setFirstName(updateUserDTO.getFirstName());
            user.setLastName(updateUserDTO.getLastName());

            String newSex = updateUserDTO.getSex();
            Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
            user.setSex(sex);

            user.setPhoneNumber(updateUserDTO.getPhoneNumber());
            user.setEmail(updateUserDTO.getEmail());
            user.setAbout(updateUserDTO.getAbout());

            if (updateUserDTO.getPassword() != null) {
                user.setPassword(updateUserDTO.getPassword());
                userService.encodePassword(user);
            }

            LocalDate birthd = LocalDate.parse(updateUserDTO.getBirthday());
            user.setBirthday(birthd);

            new UserORestController().updateAvatar(user, updateUserDTO.getAvatar(), false,
                    environment);

            if (updateUserDTO.getCountry() != null) {
                user.getAddress().setCountry(new Country(updateUserDTO.getCountry()));
            }
            if (updateUserDTO.getState() != null) {
                user.getAddress().setState(new State(updateUserDTO.getState()));
            }
            if (updateUserDTO.getCity() != null) {
                user.getAddress().setCity(new City(updateUserDTO.getCity()));
            }
            if (updateUserDTO.getStreet() != null) {
                user.getAddress().setStreet(updateUserDTO.getStreet());
            }

            return new OkResponse<User>(userService.saveUser(user)).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }
}
