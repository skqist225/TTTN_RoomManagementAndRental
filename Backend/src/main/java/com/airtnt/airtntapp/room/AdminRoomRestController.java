package com.airtnt.airtntapp.room;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.*;

import com.airtnt.airtntapp.address.AddressService;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.room.dto.PostAddRoomDTO;
import com.airtnt.airtntapp.rule.RuleService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.*;
import com.airtnt.entity.Currency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;
import com.airtnt.airtntapp.room.response.RoomsOwnedByUserResponseEntity;

@RestController
@RequestMapping("/api/admin/")
public class AdminRoomRestController {
    private final String STATIC_PATH = System.getProperty("user.dir") + "/src/main/resources/static/room_images";

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;

    @Autowired
    private RuleService ruleService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private CityService cityService;

    @Autowired
    private StateService stateService;

    @Autowired
    private Environment env;


    @GetMapping("rooms")
    public ResponseEntity<StandardJSONResponse<RoomsOwnedByUserResponseEntity>> fetchUserOwnedRooms(
            @RequestParam("page") int page,
            @RequestParam(value = "keyword", required = false) String keyword) {
        Page<Room> roomsPage = roomService.getAllRooms(page, keyword);

        List<RoomListingsDTO> roomListingsDTOs = new ArrayList<>();
        RoomsOwnedByUserResponseEntity roomsOwnedByUserResponseEntity = new RoomsOwnedByUserResponseEntity();

        for (Room room : roomsPage.getContent()) {
            roomListingsDTOs.add(RoomListingsDTO.buildRoomListingsDTO(room));
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

        roomsOwnedByUserResponseEntity.setRooms(roomListingsDTOs);
        roomsOwnedByUserResponseEntity.setTotalPages(roomsPage.getTotalPages());
        roomsOwnedByUserResponseEntity.setTotalRecords(roomsPage.getTotalElements());

        return new OkResponse<RoomsOwnedByUserResponseEntity>(roomsOwnedByUserResponseEntity).response();

    }

    @PostMapping("room/save")
    public ResponseEntity<StandardJSONResponse<String>> saveRoom(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @ModelAttribute PostAddRoomDTO payload)
            throws IOException, UserNotFoundException {
        User host = userDetailsImpl.getUser();

        Set<Rule> rules = new HashSet<>();
        Set<Amentity> amenities = new HashSet<>();
        Set<Image> images = new HashSet<>();

        for (int i = 0; i < payload.getRules().length; i++) {
            rules.add(new Rule(payload.getRules()[i]));
        }

        for (int i = 0; i < payload.getAmentities().length; i++) {
            amenities.add(new Amentity(payload.getAmentities()[i]));
        }

        for (int i = 0; i < payload.getImages().length; i++) {
            images.add(new Image(payload.getImages()[i]));
        }

        // check if city exist
        City city = cityService.getCityByName(payload.getCity());
        Address address = null;
        if (city != null) {
            address = addressService.findByStreetAndCity(payload.getStreet(), city);
            if (address == null) {
                address = new Address(city, payload.getStreet());
                address = addressService.save(address);
            }
        } else {
            State state = stateService.getStateByName(payload.getState());
            if (state == null) {
                state = new State(payload.getState());
                state = stateService.save(state);
            }
            city = new City(payload.getCity(), state);
            city = cityService.save(city);
            address = new Address(city, payload.getStreet());
            address = addressService.save(address);
        }

        host.setRole(new Role(1));
        userService.saveUser(host);

        boolean status = host.isPhoneVerified();
        Room room = Room.buildRoom(payload, images, amenities, address, rules, status);
        Room savedRoom = roomService.save(room);

        /* MOVE IMAGE TO FOLDER */
        String environment = env.getProperty("env");
        if (environment.equals("development")) {
            if (savedRoom != null) {
                String uploadDir = STATIC_PATH + "/" + host.getEmail() + "/" + savedRoom.getId();
                String source = STATIC_PATH + "/" + host.getEmail() + "/";
                Path sourcePath = Paths.get(source);
                Path targetPath = Files.createDirectories(Paths.get(uploadDir));
                for (String imageName : payload.getImages()) {
                    Files.move(sourcePath.resolve(imageName), targetPath.resolve(imageName),
                            StandardCopyOption.REPLACE_EXISTING);
                }
            }
        } else {
            String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/room_images/" + host.getEmail() + "/"
                    + savedRoom.getId();
            Path uploadPath = Paths.get(filePath);
            if (!Files.exists(uploadPath)) {
                Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                        .asFileAttribute(permissions);

                Files.createDirectories(uploadPath, fileAttributes);
            }
        }

        assert savedRoom != null;
        return new OkResponse<String>(savedRoom.getId().toString()).response();
    }

    @PostMapping("room/{roomId}/save")
    public ResponseEntity<StandardJSONResponse<String>> editRoom(@PathVariable(value = "roomId") Integer roomId, @AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @ModelAttribute PostAddRoomDTO payload)
            throws IOException, UserNotFoundException {
        Room room = null;
        try {
            room = roomService.findById(roomId);

            User host = room.getHost();

            Set<Rule> rules = new HashSet<>();
            Set<Amentity> amenities = new HashSet<>();
            Set<Image> images = new HashSet<>();

            if (payload.getRules().length > 0) {
                for (int i = 0; i < payload.getRules().length; i++) {
                    rules.add(new Rule(payload.getRules()[i]));
                }
                room.setRules(rules);
            }

            if (payload.getAmentities().length > 0) {
                for (int i = 0; i < payload.getAmentities().length; i++) {
                    amenities.add(new Amentity(payload.getAmentities()[i]));
                }
                room.setAmentities(amenities);
            }

            if (payload.getImages() != null && payload.getImages().length > 0) {
                for (int i = 0; i < payload.getImages().length; i++) {
                    images.add(new Image(payload.getImages()[i]));
                }

                Set<Image> removedSet = new HashSet<>();
                for (Image image2 : room.getImages()) {
                    for (Image image : images) {
                        if (!image2.getImage().equals(image.getImage())) {
                            removedSet.add(image2);
                        }
                    }
                }

                room.getImages().removeAll(removedSet);
                for (Image image : images) {
                    room.getImages().add(image);
                }
            }

            // check if city exist
            Address address = null;
            if (payload.getCity() != null) {
                City city = cityService.getCityByName(payload.getCity());

                if (city != null) {
                    address = addressService.findByStreetAndCity(payload.getStreet(), city);
                    if (address == null) {
                        address = new Address(city, payload.getStreet());
                        address = addressService.save(address);
                    }
                } else {
                    State state = stateService.getStateByName(payload.getState());
                    if (state == null) {
                        state = new State(payload.getState());
                        state = stateService.save(state);
                    }
                    city = new City(payload.getCity(), state);
                    city = cityService.save(city);
                    address = new Address(city, payload.getStreet());
                    address = addressService.save(address);
                }
                ;
            }

            room.setCategory(new Category(payload.getCategory()));
            room.setPrivacyType(new RoomPrivacy(payload.getPrivacyType()));

            room.setAccomodatesCount(payload.getAccomodatesCount());
            room.setBedCount(payload.getBedCount());
            room.setBedroomCount(payload.getBedroomCount());
            room.setBathroomCount(payload.getBathroomCount());

            room.setName(payload.getName());
            room.setDescription(payload.getDescription());
            room.setPrice(payload.getPrice());
            room.setCurrency(new Currency(payload.getCurrency()));

            if (payload.getLongitude() != null) {
                room.setLongitude(payload.getLongitude());
            }
            if (payload.getLatitude() != null) {
                room.setLatitude(payload.getLongitude());
            }

            if (address != null) {
                room.setAddress(address);
            }


            Room savedRoom = roomService.save(room);

            /* MOVE IMAGE TO FOLDER */
            if (payload.getImages() != null) {
                String environment = env.getProperty("env");
                if (environment.equals("development")) {
                    if (savedRoom != null) {
                        String uploadDir = STATIC_PATH + "/" + host.getEmail() + "/" + savedRoom.getId();
                        String source = STATIC_PATH + "/" + host.getEmail() + "/";
                        Path sourcePath = Paths.get(source);
                        Path targetPath = Files.createDirectories(Paths.get(uploadDir));
                        for (String imageName : payload.getImages()) {
                            Files.move(sourcePath.resolve(imageName), targetPath.resolve(imageName),
                                    StandardCopyOption.REPLACE_EXISTING);
                        }
                    }
                } else {
                    String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/room_images/" + host.getEmail() + "/"
                            + savedRoom.getId();
                    Path uploadPath = Paths.get(filePath);
                    if (!Files.exists(uploadPath)) {
                        Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                        FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                                .asFileAttribute(permissions);

                        Files.createDirectories(uploadPath, fileAttributes);
                    }
                }
            }

            assert savedRoom != null;
            return new OkResponse<String>(savedRoom.getId().toString()).response();
        } catch (RoomNotFoundException e) {
            return new BadResponse<String>(e.getMessage()).response();
        }


    }
}
