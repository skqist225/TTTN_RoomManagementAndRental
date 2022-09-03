package com.airtnt.airtntapp.room;

import com.airtnt.airtntapp.address.AddressService;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.dto.PostAddRoomDTO;
import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;
import com.airtnt.airtntapp.room.response.RoomsOwnedByUserResponseEntity;
import com.airtnt.airtntapp.rule.RuleService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.*;

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

        for (int i = 0; i < payload.getAmenities().length; i++) {
            amenities.add(new Amentity(payload.getAmenities()[i]));
        }

        for (int i = 0; i < payload.getImages().length; i++) {
            images.add(new Image(payload.getImages()[i]));
        }

        // check if city exist
        City city = cityService.getCityById(payload.getCity());
        Address address = null;
        if (city != null) {
            address = addressService.findByStreetAndCity(payload.getStreet(), city);
            if (address == null) {
                address = new Address(city, payload.getStreet());
                address = addressService.save(address);
            }
        }

        if (!host.getRole().getName().equals("Admin")) {
            host.setRole(new Role(1));
        }

        userService.saveUser(host);

        boolean status = host.isPhoneVerified();
        Room room = Room.build(payload, images, amenities, address, rules, status);
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
        Integer activeStep = payload.getActiveStep();
        try {
            Room room = roomService.findById(roomId);

            if (activeStep == 0) {
                Set<Rule> rules = new HashSet<>();
                Set<Amentity> amenities = new HashSet<>();

                if (payload.getRules().length > 0) {
                    for (int i = 0; i < payload.getRules().length; i++) {
                        rules.add(new Rule(payload.getRules()[i]));
                    }

                    Set<Rule> removedSet = new HashSet<>();
                    for (Rule rule : room.getRules()) {
                        if (!Arrays.stream(payload.getRules()).anyMatch(rule.getId()::equals)) {
                            removedSet.add(rule);
                        }
                    }

                    System.out.println("removed set : " + removedSet);
                    for (Rule rule : removedSet) {
                        room.removeRule(rule);
                    }

                    for (Rule rule : rules) {
                        room.addRule(rule);
                    }
                }

                if (payload.getAmenities().length > 0) {
                    for (int i = 0; i < payload.getAmenities().length; i++) {
                        amenities.add(new Amentity(payload.getAmenities()[i]));
                    }

                    Set<Amentity> removedSet = new HashSet<>();
                    for (Amentity amenity : room.getAmentities()) {
                        if (!Arrays.stream(payload.getAmenities()).anyMatch(amenity.getId()::equals)) {
                            removedSet.add(amenity);
                        }
                    }

                    System.out.println("removed set : " + removedSet);
                    for (Amentity amentity : removedSet) {
                        room.removeAmenity(amentity);
                    }

                    for (Amentity amentity : amenities) {
                        room.addAmenity(amentity);
                    }
                }

                room.setCategory(new Category(payload.getCategory()));
                room.setPrivacyType(new RoomPrivacy(payload.getPrivacy()));

                room.setAccomodatesCount(payload.getGuestCount());
                room.setBedCount(payload.getBedCount());
                room.setBedroomCount(payload.getBedroomCount());
                room.setBathroomCount(payload.getBathroomCount());

                room.setName(payload.getName());
                room.setDescription(payload.getDescription());
                room.setPrice(payload.getPrice());
            } else if (activeStep == 1) {
                Address address = null;
                if (payload.getCity() != null) {
                    City city = cityService.getCityById(payload.getCity());

                    if (city != null) {
                        address = addressService.findByStreetAndCity(payload.getStreet(), city);
                        if (address == null) {
                            address = new Address(city, payload.getStreet());
                            address = addressService.save(address);
                        }
                    }
                }

                if (payload.getLongitude() != null) {
                    room.setLongitude(payload.getLongitude());
                }
                if (payload.getLatitude() != null) {
                    room.setLatitude(payload.getLatitude());
                }
                if (address != null) {
                    room.setAddress(address);
                }
            } else {
                Set<Image> images = new HashSet<>();

                if (payload.getImages() != null && payload.getImages().length > 0) {
                    System.out.println(Arrays.toString(payload.getImages()));
                    for (int i = 0; i < payload.getImages().length; i++) {
                        images.add(new Image(payload.getImages()[i]));
                    }

                    Set<Image> removedSet = new HashSet<>();
                    for (Image image : room.getImages()) {
                        if (!Arrays.stream(payload.getImages()).anyMatch(image.getImage()::equals)) {
                            removedSet.add(image);
                        }
                    }

                    System.out.println("removed set : " + removedSet);
                    for (Image image : removedSet) {
                        room.removeImage(image);
                    }

                    for (Image image : images) {
                        room.addImage(image);
                    }

                    if (Objects.nonNull(payload.getThumbnail())) {
                        room.setThumbnail(payload.getThumbnail());
                    }
                }
            }

            User host = room.getHost();

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
                            if (Files.exists(sourcePath.resolve(imageName)))
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
