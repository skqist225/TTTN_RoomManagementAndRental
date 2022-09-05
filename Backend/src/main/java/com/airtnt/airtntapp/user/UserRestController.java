package com.airtnt.airtntapp.user;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.address.AddressService;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.airtntapp.user.dto.BookedRoomDTO;
import com.airtnt.airtntapp.user.dto.PostUpdateUserDTO;
import com.airtnt.airtntapp.user.dto.UpdateUserDTO;
import com.airtnt.airtntapp.user.dto.UserSexDTO;
import com.airtnt.airtntapp.user.dto.WishlistsDTO;
import com.airtnt.entity.Address;
import com.airtnt.entity.Booking;
import com.airtnt.entity.City;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;
import com.airtnt.entity.Sex;
import com.airtnt.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/")
public class UserRestController {

    public final String DEV_STATIC_PATH="src/main/resources/static/user_images/";
    public final String PROD_STATIC_PATH="/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/user_images/";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private Environment env;

    @Value("${env}")
    private String environment;

    @Autowired
    private AddressService addressService;

    @GetMapping("sex")
    public ResponseEntity<StandardJSONResponse<List<UserSexDTO>>> getSexs() {
        List<UserSexDTO> sexs = new ArrayList<UserSexDTO>();

        for (Sex sex : Sex.values()) {
            sexs.add(new UserSexDTO(sex.toString(),
                    sex.toString().equals("MALE") ? "Nam" : sex.toString().equals("FEMALE") ? "Nữ" : "Khác"));
        }

        return new OkResponse<List<UserSexDTO>>(sexs).response();
    }

    @GetMapping("wishlists/ids")
    public ResponseEntity<StandardJSONResponse<List<Integer>>> fetchWishlistsIds(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        User user = userDetailsImpl.getUser();

        return new OkResponse<List<Integer>>(
                user.getFavRooms().stream().map(favRoom -> favRoom.getId()).collect(Collectors.toList())).response();
    }

    @GetMapping("wishlists")
    public ResponseEntity<StandardJSONResponse<WishlistsDTO[]>> fetchWishlists(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        User user = userDetailsImpl.getUser();

        WishlistsDTO[] wishlists = new WishlistsDTO[user.getFavRooms().size()];
        int i = 0;

        for (Room r : user.getFavRooms()) {
            WishlistsDTO wlDTO = new WishlistsDTO();
            wlDTO.setId(r.getId());
            String[] images = new String[3];
            int j = 0;
            for (Image image : r.getImages()) {
                if (j == 3)
                    break;
                images[j++] = image.getImagePath(r.getHost().getEmail(), r.getId());
            }
            wlDTO.setImages(images);
            wishlists[i++] = wlDTO;
        }

        return new OkResponse<WishlistsDTO[]>(wishlists).response();
    }

    @PutMapping("update-personal-info")
    public ResponseEntity<StandardJSONResponse<User>> updatePersonalInfo(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestBody PostUpdateUserDTO postUpdateUserDTO)
            throws IOException {
        User currentUser = userDetailsImpl.getUser();

        User savedUser = null;
        String updatedField = postUpdateUserDTO.getUpdatedField();
        Map<String, String> updateData = postUpdateUserDTO.getUpdateData();

        switch (updatedField) {
            case "firstNameAndLastName": {
                if (updateData.get("firstName") == null && updateData.get("lastName") == null) {
                    return new BadResponse<User>("First name or last name is required").response();
                }

                if (updateData.get("firstName") != null) {
                    currentUser.setFirstName(updateData.get("firstName"));
                }
                if (updateData.get("lastName") != null) {
                    currentUser.setLastName(updateData.get("lastName"));
                }
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "sex": {
                String newSex = updateData.get("sex");
                Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
                currentUser.setSex(sex);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "gender": {
                if (updateData.get("gender") == null) {
                    return new BadResponse<User>("Gender is required").response();
                }
                String newSex = updateData.get("gender");
                Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
                currentUser.setSex(sex);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "birthday": {
                String birthdayStr = updateData.get("birthday");
                if (Objects.isNull(birthdayStr)) {
                    return new BadResponse<User>("Birthday is required").response();
                }

                LocalDate birthday = LocalDate.parse(updateData.get("birthday"));
                System.out.println(birthday);
                if (userService.checkBirthday(birthday)) {
                    return new BadResponse<User>("Your age must be greater than 18").response();
                }

                currentUser.setBirthday(birthday);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "address": {
                int cityId = Integer.parseInt(updateData.get("city"));
                String street = updateData.get("street");

                Address address = addressService.findByStreetAndCity(street, new City(cityId));
                if (address != null) {
                    currentUser.setAddress(address);
                } else {
                    address = new Address(new City(cityId), street);
                    currentUser.setAddress(addressService.save(address));
                }

                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "password": {
                String oldPassword = updateData.get("oldPassword");
                String newPassword = updateData.get("newPassword");

                ArrayNode arrays = objectMapper.createArrayNode();

                if (!userService.isPasswordMatch(oldPassword, currentUser.getPassword())) {
                    ObjectNode node = objectMapper.createObjectNode();
                    node.put("oldPassword", "Old password does not correct");
                    arrays.add(node);
                }

                if (newPassword.length() < 8) {
                    ObjectNode node = objectMapper.createObjectNode();
                    node.put("newPassword", "New password length must be greater than 8 characters");
                    arrays.add(node);
                }

                if (arrays.size() > 0) {
                    return new BadResponse<User>(arrays.toString()).response();
                }

                currentUser.setPassword(newPassword);
                userService.encodePassword(currentUser);
                savedUser = userService.saveUser(currentUser);
                break;
            }
            case "phoneNumber": {
                String newPhoneNumber = updateData.get("phoneNumber");

                if (userService.checkPhoneNumber(newPhoneNumber, true, currentUser.getId())) {
                    return new BadResponse<User>("Phone number has already been taken").response();
                }

                currentUser.setPhoneNumber(newPhoneNumber);
                savedUser = userService.saveUser(currentUser);
                break;
            }
        }

        return new OkResponse<User>(savedUser).response();
    }

    @PutMapping("update")
    public ResponseEntity<StandardJSONResponse<User>> updateUser(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @RequestBody UpdateUserDTO postUpdateUserDTO) {
        User currentUser = userDetailsImpl.getUser();

        if (postUpdateUserDTO.getFirstName() == null && postUpdateUserDTO.getLastName() == null) {
            return new BadResponse<User>("First name or last name is required").response();
        }
        if (postUpdateUserDTO.getFirstName() != null) {
            currentUser.setFirstName(postUpdateUserDTO.getFirstName());
        }
        if (postUpdateUserDTO.getLastName() != null) {
            currentUser.setLastName(postUpdateUserDTO.getLastName());
        }

        if (postUpdateUserDTO.getSex() == null) {
            return new BadResponse<User>("Gender is required").response();
        }

        String newSex = postUpdateUserDTO.getSex();
        Sex sex = newSex.equals("MALE") ? Sex.MALE : newSex.equals("FEMALE") ? Sex.FEMALE : Sex.OTHER;
        currentUser.setSex(sex);

        if (postUpdateUserDTO.getBirthday() == null) {
            return new BadResponse<User>("Birthday is required").response();
        }

        LocalDate birthd = LocalDate.parse(postUpdateUserDTO.getBirthday());
        currentUser.setBirthday(birthd);

        return new OkResponse<User>(userService.saveUser(currentUser)).response();
    }

    public User updateAvatar(User user, MultipartFile newAvatar, boolean isCallFromInternal, String environment)
            throws IOException {
        if (newAvatar != null) {
            String fileName = StringUtils.cleanPath(newAvatar.getOriginalFilename());
            String uploadDir = "";
            if (environment.equals("development")) {
                uploadDir = DEV_STATIC_PATH + user.getId() + "/";
            } else {
                String filePath = PROD_STATIC_PATH + user.getId() + "/";
                Path uploadPath = Paths.get(filePath);
                if (!Files.exists(uploadPath)) {
                    Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                    FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                            .asFileAttribute(permissions);

                    Files.createDirectories(uploadPath, fileAttributes);
                }
                uploadDir = GetResource.getResourceAsFile("static/user_images/" + user.getId() + "/");
                System.out.println(uploadDir);
            }

            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, newAvatar);
            user.setAvatar(fileName);
        } else {
            if (isCallFromInternal) {
                return null;
            }
        }

        return user;
    }

    @PutMapping("update-avatar")
    public ResponseEntity<StandardJSONResponse<User>> updateUserAvatar(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestParam(name = "newAvatar", required = false) MultipartFile newAvatar) throws IOException {
        User user = userDetailsImpl.getUser();

        User savedAvatarUser = updateAvatar(user, newAvatar, true, environment);
        if (savedAvatarUser != null) {
            User savedUser = userService.saveUser(savedAvatarUser);
            return new OkResponse<>(savedUser).response();
        }

        return new BadResponse<User>("Please add image").response();
    }

    @PutMapping("add-to-favoritelists/{roomId}")
    public ResponseEntity<StandardJSONResponse<String>> addToWishLists(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("roomId") Integer roomid) {
        User user = userDetailsImpl.getUser();

        try {
            user.addToWishLists(roomService.findById(roomid));

            User savedUser = userService.saveUser(user);
            if (savedUser != null) {
                return new OkResponse<String>("add to wishlists successfully").response();
            }

            return new BadResponse<String>("can not sync user data into database").response();
        } catch (RoomNotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @GetMapping("remove-from-favoritelists/{roomId}")
    public ResponseEntity<StandardJSONResponse<String>> removeFromWishLists(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("roomId") Integer roomId) throws RoomNotFoundException {
        User user = userDetailsImpl.getUser();

        userService.removeFromFavLists(user.getId(),roomId);

        User savedUser = userService.saveUser(user);
        if (savedUser != null) {
            return new OkResponse<String>("remove from wishlists successfully").response();
        }

        return new BadResponse<String>("can not sync user data into database").response();
    }

    @GetMapping("booked-rooms")
    public ResponseEntity<StandardJSONResponse<List<BookedRoomDTO>>> getUserBookedRooms(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
            @RequestParam(value = "query", required = false, defaultValue = "") String query) {
        User user = userDetailsImpl.getUser();

        List<Booking> bookings = bookingService.getBookingsByUser(user.getId(), query);

        List<BookedRoomDTO> bookedRoomDetails = new ArrayList<>();

        for (Booking booking : bookings) {
            List<BookedRoomDTO> bookedRoomDetailss = BookedRoomDTO.build(booking);
            bookedRoomDetails.addAll(bookedRoomDetails);
        }

        return new OkResponse<>(bookedRoomDetails).response();
    }

    @GetMapping("info")
    public ResponseEntity<StandardJSONResponse<User>> getUserInfo(
            @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        return new OkResponse<>(userDetailsImpl.getUser()).response();
    }
}
