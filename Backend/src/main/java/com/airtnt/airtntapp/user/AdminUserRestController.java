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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
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

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/admin/")
public class AdminUserRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private ObjectMapper objectMapper;

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

    @DeleteMapping("users/{userId}")
    public ResponseEntity<StandardJSONResponse<String>> deleteUser(@PathVariable(value = "userId") Integer userId) {
        try {
            return new OkResponse<String>(userService.deleteById(userId)).response();
        } catch (UserNotFoundException | VerifiedUserException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("users/{id}/{action}")
    public ResponseEntity<StandardJSONResponse<String>> disableUser(@PathVariable(value = "id") Integer id, @PathVariable(value = "action") String action) {
        try {
            User user = userService.findById(id);
            user.setStatus(action.equals("enable"));
            userService.saveUser(user);

            return new OkResponse<String>("Update User Successfully").response();
        } catch (UserNotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("users/{id}/update")
    public ResponseEntity<StandardJSONResponse<User>> updateUser(@PathVariable(value = "id") Integer userId,
                                                                 @RequestBody UpdateUserDTO updateUserDTO) throws IOException {
        try {
            User user = userService.findById(userId);

            ArrayNode arrays = objectMapper.createArrayNode();

            if (userService.checkBirthday(LocalDate.parse(updateUserDTO.getBirthday()))) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("birthday", "Your age must be greater than 18");
                arrays.add(node);
            }

            if (userService.checkPhoneNumber(updateUserDTO.getPhoneNumber(), true, userId)) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("phoneNumber", "Phone number has already been taken");
                arrays.add(node);
            }

            if (updateUserDTO.getPhoneNumber().length() != 10) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("phoneNumberCharacter", "Phone number must be 10 characters");
                arrays.add(node);
            }

            Pattern pattern = Pattern.compile("^\\d{10}$");
            Matcher matcher = pattern.matcher(updateUserDTO.getPhoneNumber());
            if (!matcher.matches()) {
                ObjectNode node = objectMapper.createObjectNode();
                node.put("phoneNumberString", "Phone number must be 10 characters");
                arrays.add(node);
            }

            if (arrays.size() > 0) {
                return new BadResponse<User>(arrays.toString()).response();
            }

            user.setFirstName(updateUserDTO.getFirstName());
            user.setLastName(updateUserDTO.getLastName());

            String newSex = updateUserDTO.getSex();
            Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
            user.setSex(sex);

            user.setPhoneNumber(updateUserDTO.getPhoneNumber());
            user.setAbout(updateUserDTO.getAbout());

            if (updateUserDTO.getPassword() != null) {
                user.setPassword(updateUserDTO.getPassword());
                userService.encodePassword(user);
            }

            user.setBirthday(LocalDate.parse(updateUserDTO.getBirthday()));

            new UserRestController().updateAvatar(user, updateUserDTO.getAvatar(), false,
                    environment);


            if (updateUserDTO.getCity() != null && updateUserDTO.getStreet() != null) {
                Address address = null;
                if (user.getAddress() != null) {
                    address = addressService.findById(user.getAddress().getId());
                }

                if (address == null) {
                    if (Objects.nonNull(updateUserDTO.getCity()) && Objects.nonNull(updateUserDTO.getStreet())) {
                        address = new Address(new City(updateUserDTO.getCity()), updateUserDTO.getStreet());

                        Address savedAddress = addressService.save(address);
                        user.setAddress(savedAddress);
                    }
                } else {
                    if (updateUserDTO.getCity() != null) {
                        address.setCity(new City(updateUserDTO.getCity()));
                    }
                    if (updateUserDTO.getStreet() != null) {
                        address.setStreet(updateUserDTO.getStreet());
                    }

                    addressService.save(address);
                }
            }


            return new OkResponse<>(userService.saveUser(user)).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }
}
