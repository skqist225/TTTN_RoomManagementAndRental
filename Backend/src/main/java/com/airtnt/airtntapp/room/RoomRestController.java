package com.airtnt.airtntapp.room;

import com.airtnt.airtntapp.amenity.dto.AmenityRoomDetailsDTO;
import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.calendar.CalendarClass;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.review.ReviewService;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.airtntapp.room.dto.HostDTO;
import com.airtnt.airtntapp.room.dto.PostAddRoomDTO;
import com.airtnt.airtntapp.room.dto.RoomDetailsDTO;
import com.airtnt.airtntapp.room.dto.RoomHomePageDTO;
import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;
import com.airtnt.airtntapp.room.response.CalendarResponseEntity;
import com.airtnt.airtntapp.room.response.RoomsOwnedByUserResponseEntity;
import com.airtnt.airtntapp.rule.RuleService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class RoomRestController {
	private final String STATIC_PATH = System.getProperty("user.dir") + "/src/main/resources/static/room_images";

	// @Autowired
	// RedisTemplate redisTemplate;

	@Autowired
	private RoomService roomService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private UserService userService;

	@Autowired
	private RuleService ruleService;

	@Autowired
	private StateService stateService;

	@Autowired
	private CityService cityService;

	@Autowired
	private ReviewService reviewService;

	@Autowired
	private Environment env;

	@RequestMapping("/api/rooms")
	public ResponseEntity<StandardJSONResponse<List<RoomHomePageDTO>>> fetchRoomsByCategoryId(
			@RequestParam("categoryId") Integer categoryId,
			@RequestParam(value = "privacy", required = false, defaultValue = "") String privacies,
			@RequestParam(value = "minPrice", required = false, defaultValue = "0") String minPrice,
			@RequestParam(value = "maxPrice", required = false, defaultValue = "1000000000") String maxPrice,
			@RequestParam(value = "bedRoom", required = false, defaultValue = "0") String bedRoom,
			@RequestParam(value = "bed", required = false, defaultValue = "0") String bed,
			@RequestParam(value = "bathRoom", required = false, defaultValue = "0") String bathRoom,
			@RequestParam(value = "amenities", required = false, defaultValue = "") String amenitiesFilter,
			@RequestParam(value = "bookingDates", required = false, defaultValue = "") String bookingDates,
			@RequestParam(value = "query", required = false, defaultValue = "") String query) throws ParseException {
		Map<String, String> filters = new HashMap<>();
		filters.put("privacies", privacies);
		filters.put("minPrice", minPrice);
		filters.put("maxPrice", maxPrice);
		filters.put("bedRoom", bedRoom);
		filters.put("bed", bed);
		filters.put("bathRoom", bathRoom);
		filters.put("amenities", amenitiesFilter);
		filters.put("bookingDates", bookingDates);
		filters.put("query", query);

		List<Room> rooms = roomService.getRoomsByCategoryId(categoryId, true, 1, filters).getContent();

		List<RoomHomePageDTO> roomHomePageDTOs = new ArrayList<>();

		rooms.forEach(
				room -> roomHomePageDTOs.add(RoomHomePageDTO.build(room, roomService.getLikedUsers(room.getId()))));

		return new OkResponse<List<RoomHomePageDTO>>(roomHomePageDTOs).response();
	}

	@GetMapping("/api/room/{roomId}")
	public ResponseEntity<StandardJSONResponse<RoomDetailsDTO>> fetchRoomById(@PathVariable("roomId") Integer id)
			throws RoomNotFoundException, ParseException {
		Room room = roomService.getById(id);

		List<Integer> bookingIds = bookingService.getBookingIdsByRoom(room);

		List<Review> reviews = reviewService.getReviewsByBookings(bookingIds);

		float avgRatings = 0;
		for (Review r : reviews) {
			avgRatings += r.getFinalRating();
		}

		if (reviews.size() > 0) {
			avgRatings /= reviews.size();
		}

		List<AmenityRoomDetailsDTO> amenityRoomDetailsDTOs = room.getAmentities().stream()
				.map(amenity -> AmenityRoomDetailsDTO.build(amenity)).collect(Collectors.toList());
		List<ReviewDTO> reviewDTOs = reviews.stream().map(review -> ReviewDTO.build(review))
				.collect(Collectors.toList());
		List<BookedDateDTO> bookedDates = bookingService.getBookedDates(room);

		HostDTO hostDTO = HostDTO.buildHostDTO(room);
		RoomDetailsDTO roomDetailsDTO = RoomDetailsDTO.buildRoomDetailsDTO(room, reviewDTOs, amenityRoomDetailsDTOs,
				hostDTO, bookedDates, avgRatings);

		return new OkResponse<RoomDetailsDTO>(roomDetailsDTO).response();
	}

	@GetMapping("/calendar/{selectedMonth}/{selectedYear}")
	public String getCalendayByYearAndMonth(@PathVariable("selectedYear") int selectedYear,
			@PathVariable("selectedMonth") int selectedMonth) {
		List<String> daysInMonth = CalendarClass.getDaysInMonth(selectedMonth - 1, selectedYear);
		String strDaysInMonth = daysInMonth.stream().map(Object::toString).collect(Collectors.joining(" "));
		GregorianCalendar gCal = new GregorianCalendar(selectedYear, selectedMonth - 1, 1);
		int startInWeek = gCal.get(Calendar.DAY_OF_WEEK); // ngày thứ mấy trong tuần đó
		return new JSONObject().put("daysInMonth", strDaysInMonth).put("startInWeek", startInWeek).toString();
	}

	@GetMapping("/api/calendar/{selectedMonth}/{selectedYear}")
	public ResponseEntity<StandardJSONResponse<CalendarResponseEntity>> getCalendayByYearAndMonthV2(
			@PathVariable("selectedYear") int selectedYear, @PathVariable("selectedMonth") int selectedMonth) {
		List<String> daysInMonth = CalendarClass.getDaysInMonth(selectedMonth - 1, selectedYear);
		String strDaysInMonth = daysInMonth.stream().map(Object::toString).collect(Collectors.joining(" "));
		GregorianCalendar gCal = new GregorianCalendar(selectedYear, selectedMonth - 1, 1);
		int startInWeek = gCal.get(Calendar.DAY_OF_WEEK); // ngày thứ mấy trong tuần đó

		return new OkResponse<CalendarResponseEntity>(new CalendarResponseEntity(strDaysInMonth, startInWeek))
				.response();
	}

	@PostMapping("/room/verify-phone")
	public String verifyPhoneForRoom(@RequestBody Map<String, Integer> payload) {
		Integer roomId = payload.get("roomId");
		try {
			Room room = roomService.findById(roomId);

			int isUpdated = userService.verifyPhoneNumber(room.getHost().getId());
			if (isUpdated == 1) {
				return "success";
			}

			return "failure";
		} catch (RoomNotFoundException e) {
			return "failure";
		}
	}

	@PostMapping("/api/room/save")
	public String saveRoom(@AuthenticationPrincipal UserDetails userDetails, @ModelAttribute PostAddRoomDTO payload)
			throws IOException, UserNotFoundException {
		Set<Rule> rules = new HashSet<>();
		Set<Amentity> amenities = new HashSet<>();
		Set<Image> images = new HashSet<>();

		Iterator<Rule> itr = ruleService.listAllRule();
		itr.forEachRemaining(rules::add);

		for (int i = 0; i < payload.getAmentities().length; i++) {
			amenities.add(new Amentity(payload.getAmentities()[i]));
		}

		for (int i = 0; i < payload.getImages().length; i++) {
			images.add(new Image(payload.getImages()[i]));
		}

		Country country = new Country(payload.getCountry());

//		 check if state exist
//		State state = stateService.getStateById(payload.getState());
//		if (state == null)
//			state = new State(payload.getState(), country);
//
//		// check if city exist
//		City city = cityService.getCityByName(payload.getCity());
//		if (city == null)
//			city = new City(payload.getCity(), state);

		User user = userService.findById(payload.getHost());
		user.setRole(new Role(1));
		userService.saveUser(user);

		boolean status = user.isPhoneVerified();
//		Address address = new Address(city, "");
		Address address = null;
		Room room = Room.buildRoom(payload, images, amenities, address, rules, status);
		Room savedRoom = roomService.save(room);

		/* MOVE IMAGE TO FOLDER */
		String environment = env.getProperty("env");
		if (environment.equals("development")) {
			if (savedRoom != null) {
				String uploadDir = STATIC_PATH + "/" + user.getEmail() + "/" + savedRoom.getId();
				String source = STATIC_PATH + "/" + user.getEmail() + "/";
				Path sourcePath = Paths.get(source);
				Path targetPath = Files.createDirectories(Paths.get(uploadDir));
				for (String imageName : payload.getImages()) {
					Files.move(sourcePath.resolve(imageName), targetPath.resolve(imageName),
							StandardCopyOption.REPLACE_EXISTING);
				}
			}
		} else {
			String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/room_images/" + user.getEmail() + "/"
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
		return savedRoom.getId() + "";
	}

	@GetMapping("/api/rooms/user/{pageid}")
	public ResponseEntity<StandardJSONResponse<RoomsOwnedByUserResponseEntity>> fetchUserOwnedRooms(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("pageid") Integer pageNumber,
			@RequestParam(name = "BATHROOMS", required = false, defaultValue = "0") String bathRoomsCount,
			@RequestParam(name = "BEDROOMS", required = false, defaultValue = "0") String bedRoomsCount,
			@RequestParam(name = "BEDS", required = false, defaultValue = "0") String bedsCount,
			@RequestParam(name = "QUERY", required = false, defaultValue = "") String query,
			@RequestParam(name = "SORTDIR", required = false, defaultValue = "DESC") String sortDir,
			@RequestParam(name = "SORTFIELD", required = false, defaultValue = "createdDate") String sortField,
			@RequestParam(name = "AMENITY_IDS", required = false, defaultValue = "") String amentitiesFilter,
			@RequestParam(name = "STATUSES", required = false, defaultValue = "ACTIVE UNLISTED") String status) {
		User host = userDetailsImpl.getUser();

		Map<String, String> filters = new HashMap<>();
		filters.put("bedroomCount", bedRoomsCount);
		filters.put("bathroomCount", bathRoomsCount);
		filters.put("bedCount", bedsCount);
		filters.put("query", query);
		filters.put("sortDir", sortDir);
		filters.put("sortField", sortField);
		filters.put("amentities", amentitiesFilter);
		filters.put("status", status);
		List<RoomListingsDTO> roomListingsDTOs = new ArrayList<>();
		RoomsOwnedByUserResponseEntity roomsOwnedByUserResponseEntity = new RoomsOwnedByUserResponseEntity();

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
		Page<Room> roomsPage = roomService.fetchUserOwnedRooms(host, pageNumber, filters);
		for (Room room : roomsPage.getContent()) {
			roomListingsDTOs.add(RoomListingsDTO.buildRoomListingsDTO(room));
			// redisTemplate.opsForHash().put("ROOM", room.getId().toString(),
			// RoomListingsDTO.buildRoomListingsDTO(room));
		}
		// redisTemplate.opsForHash().put("TOTAL_PAGES", "TOTAL_PAGES", (Integer)
		// roomsPage.getTotalPages());
		// redisTemplate.opsForHash().put("TOTAL_ELS", "TOTAL_ELS", (Long)
		// roomsPage.getTotalElements());

		roomsOwnedByUserResponseEntity.setRooms(roomListingsDTOs);
		roomsOwnedByUserResponseEntity.setTotalPages(roomsPage.getTotalPages());
		roomsOwnedByUserResponseEntity.setTotalRecords(roomsPage.getTotalElements());
		// }

		return new OkResponse<RoomsOwnedByUserResponseEntity>(roomsOwnedByUserResponseEntity).response();

	}

	@GetMapping("/api/rooms/average-price")
	public ResponseEntity<StandardJSONResponse<Double>> getAverageRoomPrice() {
		return new OkResponse<Double>(roomService.getAverageRoomPrice()).response();
	}
}
