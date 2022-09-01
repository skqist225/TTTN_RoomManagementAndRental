package com.airtnt.airtntapp.user;

import com.airtnt.airtntapp.address.AddressService;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.exception.VerifiedUserException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.user.dto.UpdateUserDTO;
import com.airtnt.airtntapp.user.dto.UserListDTO;
import com.airtnt.airtntapp.user.dto.UserListResponse;
import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import com.airtnt.entity.Sex;
import com.airtnt.entity.User;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin/")
public class AdminUserRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

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
    public ResponseEntity<StandardJSONResponse<String>> deleteUser(@PathVariable(value = "id") Integer id) {
        try {
            return new OkResponse<String>(userService.deleteById(id)).response();
        } catch (UserNotFoundException | VerifiedUserException e) {
            return new BadResponse<String>(e.getMessage()).response();
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

//            if (updateUserDTO.getCountry() != null) {
//                user.getAddress().setCountry(new Country(updateUserDTO.getCountry()));
//            }
//            if (updateUserDTO.getState() != null) {
//                user.getAddress().setState(new State(updateUserDTO.getState()));
//            }

            Address address = null;
            if (user.getAddress() != null) {
                address = addressService.findById(user.getAddress().getId());
            }

            if (address == null) {
                if (Objects.nonNull(updateUserDTO.getCity()) && Objects.nonNull(updateUserDTO.getStreet())) {
                    address = new Address(new City(updateUserDTO.getCity()), updateUserDTO.getStreet());
                }
            } else {
                if (updateUserDTO.getCity() != null) {
                    address.setCity(new City(updateUserDTO.getCity()));
                }
                if (updateUserDTO.getStreet() != null) {
                    address.setStreet(updateUserDTO.getStreet());
                }
            }

            if(address != null) {
                addressService.save(address);
            }

            return new OkResponse<User>(userService.saveUser(user)).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }
}
