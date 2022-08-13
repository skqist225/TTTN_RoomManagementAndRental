package com.airtnt.airtntapp.user;

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
import java.util.Set;
import java.util.stream.Collectors;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.booking.BookingService;
import com.airtnt.airtntapp.city.CityService;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.airtntapp.country.CountryService;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.airtntapp.state.StateService;
import com.airtnt.airtntapp.user.dto.BookedRoomDTO;
import com.airtnt.airtntapp.user.dto.CreateHostReviewDTO;
import com.airtnt.airtntapp.user.dto.CreateHostReviewDTOTest;
import com.airtnt.airtntapp.user.dto.PostUpdateUserDTO;
import com.airtnt.airtntapp.user.dto.UpdateUserDTO;
import com.airtnt.airtntapp.user.dto.UserSexDTO;
import com.airtnt.airtntapp.user.dto.WishlistsDTO;
import com.airtnt.airtntapp.userReview.UserReviewService;
import com.airtnt.entity.Address;
import com.airtnt.entity.Chat;
import com.airtnt.entity.City;
import com.airtnt.entity.Country;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;
import com.airtnt.entity.Sex;
import com.airtnt.entity.State;
import com.airtnt.entity.User;
import com.airtnt.entity.UserReview;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/user/")
public class UserORestController {

	public final String REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESSFULLY";
	public final String REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";

	public final String LOGIN_SUCCESS = "LOGIN_SUCCESSFULLY";
	public final String LOGOUT_SUCCESS = "LOGOUT_SUCCESSFULLY";

	public final String UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESSFULLY";
	public final String UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

	@Autowired
	private UserService userService;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private CountryService countryService;

	@Autowired
	private StateService stateService;

	@Autowired
	private CityService cityService;

	@Autowired
	private RoomService roomService;

	@Autowired
	private Environment env;

	@Value("${env}")
	private String environment;

	@Autowired
	private UserReviewService UserReviewService;

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
			case "birthdayWeb": {
				Integer yearOfBirth = Integer.parseInt(updateData.get("yearOfBirth"));
				Integer monthOfBirth = Integer.parseInt(updateData.get("monthOfBirth"));
				Integer dayOfBirth = Integer.parseInt(updateData.get("dayOfBirth"));

				currentUser.setBirthday(LocalDate.of(yearOfBirth, monthOfBirth, dayOfBirth));
				savedUser = userService.saveUser(currentUser);
				break;
			}
			case "birthday": {
				if (updateData.get("birthday") == null) {
					return new BadResponse<User>("Birthday is required").response();
				}
				LocalDate birthd = LocalDate.parse(updateData.get("birthday"));
				currentUser.setBirthday(birthd);
				savedUser = userService.saveUser(currentUser);
				break;
			}
			case "address": {
				Integer countryId = Integer.parseInt(updateData.get("country"));
				Integer stateId = Integer.parseInt(updateData.get("country"));
				Integer cityId = Integer.parseInt(updateData.get("country"));
				String aprtNoAndStreet = updateData.get("aprtNoAndStreet");

				Country country = countryService.getCountryById(countryId);
				State state = stateService.getStateById(stateId);
				City city = cityService.getCityById(cityId);

				Address newAddress = new Address(country, state, city, aprtNoAndStreet);
				currentUser.setAddress(newAddress);
				savedUser = userService.saveUser(currentUser);
				break;
			}
			case "email": {
				String newEmail = updateData.get("email");
				currentUser.setEmail(newEmail);
				savedUser = userService.saveUser(currentUser);

				// return ResponseEntity.ok()
				// .header(HttpHeaders.SET_COOKIE,
				// cookiePorcess.writeCookie("user", savedUser.getEmail()).toString())
				// .body(new StandardJSONResponse<User>(true, savedUser, null));
			}
			case "password": {
				String newPassword = updateData.get("newPassword");

				currentUser.setPassword(newPassword);
				userService.encodePassword(currentUser);
				savedUser = userService.saveUser(currentUser);
				break;
			}
			case "phoneNumber": {
				String newPhoneNumber = updateData.get("phoneNumber");

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
				uploadDir = "src/main/resources/static/user_images/" + user.getId() + "/";
			} else {
				String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/user_images/" + user.getId()
						+ "/";
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
			return new OkResponse<User>(savedUser).response();
		}

		return new BadResponse<User>("Please add image").response();
	}

	@PutMapping("add-to-favoritelists/{roomid}")
	public ResponseEntity<StandardJSONResponse<String>> addToWishLists(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("roomid") Integer roomid) {
		User user = userDetailsImpl.getUser();

		try {
			user.addToWishLists(roomService.getRoomById(roomid));

			User savedUser = userService.saveUser(user);
			if (savedUser != null) {
				return new OkResponse<String>("add to wishlists successfully").response();
			}

			return new BadResponse<String>("can not sync user data into database").response();
		} catch (RoomNotFoundException e) {
			return new BadResponse<String>(e.getMessage()).response();
		}
	}

	@PutMapping("remove-from-favoritelists/{roomid}")
	public ResponseEntity<StandardJSONResponse<String>> removeFromWishLists(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl, @PathVariable("roomid") Integer roomId) {
		User user = userDetailsImpl.getUser();
		try {
			user.removeFromWishLists(roomService.getRoomById(roomId));

			User savedUser = userService.saveUser(user);
			if (savedUser != null) {
				return new OkResponse<String>("remove from wishlists successfully").response();
			}

			return new BadResponse<String>("can not sync user data into database").response();
		} catch (RoomNotFoundException e) {
			return new BadResponse<String>(e.getMessage()).response();
		}
	}

	@PostMapping("create-host-review")
	public ResponseEntity<StandardJSONResponse<UserReview>> createHostReview(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
			@RequestBody CreateHostReviewDTO createHostReviewDTO) {
		User reviewer = userDetailsImpl.getUser();
		User host;
		try {
			host = userService.findById(createHostReviewDTO.getHostId());

			UserReview userReview = new UserReview(host, reviewer, createHostReviewDTO.getReview());

			UserReview savedUserReview = UserReviewService.save(userReview);

			return new OkResponse<UserReview>(savedUserReview).response();
		} catch (UserNotFoundException e) {
			return new BadResponse<UserReview>(e.getMessage()).response();
		}
	}

	@PostMapping("create-host-review-test")
	public ResponseEntity<StandardJSONResponse<UserReview>> createHostReview(
			@RequestBody CreateHostReviewDTOTest createHostReviewDTO) {
		User host, reviewer;
		try {
			reviewer = userService.findById(createHostReviewDTO.getReviewerId());
			host = userService.findById(createHostReviewDTO.getHostId());

			UserReview userReview = new UserReview(host, reviewer, createHostReviewDTO.getReview());

			UserReview savedUserReview = UserReviewService.save(userReview);

			return new OkResponse<UserReview>(savedUserReview).response();
		} catch (UserNotFoundException e) {
			return new BadResponse<UserReview>(e.getMessage()).response();
		}
	}

	@GetMapping("booked-rooms")
	public ResponseEntity<StandardJSONResponse<List<BookedRoomDTO>>> getUserBookedRooms(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl,
			@RequestParam(value = "query", required = false, defaultValue = "") String query) {
		User user = userDetailsImpl.getUser();
		List<BookedRoomDTO> bookings = bookingService.getBookedRoomsByUser(user.getId(), query);

		return new OkResponse<List<BookedRoomDTO>>(bookings).response();
	}

	@GetMapping("inbox")
	public ResponseEntity<StandardJSONResponse<List<Chat>>> getUserChats(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
		User user = userDetailsImpl.getUser();
		// return new OkResponse<List<Chat>>(user.getSender()).response();

		return null;
	}

	@GetMapping("info")
	public ResponseEntity<StandardJSONResponse<User>> getUserInfo(
			@AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
		return new OkResponse<User>(userDetailsImpl.getUser()).response();
	}
}
