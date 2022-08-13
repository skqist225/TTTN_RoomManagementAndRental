package com.airtnt.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.format.annotation.DateTimeFormat;

import com.airtnt.airtntapp.user.dto.RegisterDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
@Entity
@Table(name = "users")
public class User extends BaseEntity {

	@JsonIgnore
	private String avatar;

	@NotEmpty(message = "Tên không được để trống.")
	@Column(nullable = false, length = 48)
	private String firstName;

	@NotEmpty(message = "Họ không được để trống.")
	@Column(nullable = false, length = 48)
	private String lastName;

	@Enumerated(EnumType.STRING)
	@Column(length = 10, nullable = false)
	private Sex sex;

	@PastOrPresent(message = "Không thể chọn ngày lớn hơn hiện tại")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate birthday;

	@Email(message = "Không đúng định dạng email.")
	@NotEmpty(message = "Email không được để trống.")
	@Column(nullable = false, unique = true)
	private String email;

	@NotEmpty(message = "Mật khẩu không được để trống.")
	@Size(min = 8, max = 512, message = "Mật khẩu phải ít nhất 8 kí tự.")
	@Column(nullable = false, length = 255)
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@JsonIgnore
	private String password;

	@ManyToOne
	@JoinColumn(name = "role_id")
	private Role role;

	@Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải là 10 chữ số")
	@Column(length = 10, nullable = false, unique = true)
	private String phoneNumber;

	@Builder.Default
	@JsonIgnore
	@OneToMany(mappedBy = "host", fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	private List<Room> ownedRooms = new ArrayList<>();

	@Builder.Default
	@JsonIgnore
	@OneToMany(mappedBy = "owner", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
	private List<Card> cards = new ArrayList<>();

	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "address_id")
	private Address address;

	@Builder.Default
	@Column(columnDefinition = "boolean default false")
	private boolean SupremeHost = false;

	@Builder.Default
	@Column(name = "phone_verified", columnDefinition = "boolean default false")
	private boolean phoneVerified = false;

	@Builder.Default
	@Column(name = "identity_verified", columnDefinition = "boolean default false")
	private boolean identityVerified = false;

	@Builder.Default
	@Column(name = "email_verified", columnDefinition = "boolean default false")
	private boolean emailVerified = false;

	@Column(length = 1024)
	private String about;

	@Builder.Default
	@JsonIgnore
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "users_favorite_rooms", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "room_id"))
	private Set<Room> favRooms = new HashSet<>();

	@JsonIgnore
	private Integer resetPasswordCode;

	@JsonIgnore
	private LocalDateTime resetPasswordExpirationTime;

	@Transient
	public String token;

	@Builder.Default
	@OneToMany(mappedBy = "host")
	private Set<UserReview> reviews = new HashSet<>();

	public User(int id) {
		super(id);
	}

	@Transient
	public String getAvatarPath() {
		if (this.getId() == null || this.avatar == null) {
			return "/images/default_user_avatar.png";
		}

		return String.format("/user_images/%s/%s", this.getId(), this.avatar);
	}

	@Transient
	public String getFullName() {
		return String.format("%s %s", this.firstName, this.lastName);
	}

	@Transient
	public String getFullPathAddress() {
		if (this.address != null) {
			return String.format("%s, %s, %s, %s", this.address.getStreet(), this.address.getCity().getName(),
					this.address.getState().getName(), this.address.getCountry().getName());
		}

		return "";
	}

	@Transient
	public ObjectNode getAddressDetails() throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode objectNode = mapper.createObjectNode();
		ObjectNode countryNode = mapper.createObjectNode();
		ObjectNode stateNode = mapper.createObjectNode();
		ObjectNode cityNode = mapper.createObjectNode();

		if (this.address != null) {
			Country country = this.address.getCountry();
			State state = this.address.getState();
			City city = this.address.getCity();

			objectNode.set("country", countryNode.put("id", country.getId()).put("name", country.getName()));
			objectNode.set("state", stateNode.put("id", state.getId()).put("name", state.getName()));
			objectNode.set("city", cityNode.put("id", city.getId()).put("name", city.getName()));
			objectNode.put("street", this.address.getStreet());
		}

		return objectNode;
	}

	@Transient
	public ArrayNode getTheTwoMostBookedRoom() throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode roomArray = mapper.createArrayNode();

		if (this.ownedRooms.size() > 0) {
			for (int i = 0; i < 2; i++) {
				ObjectNode roomNode = mapper.createObjectNode();
				ArrayNode imagesNode = mapper.createArrayNode();
				Room room = this.getOwnedRooms().get(i);
				room.getImagesPath().forEach(image -> imagesNode.add(image));
				roomNode.put("id", room.getId()).put("name", room.getName()).put("thumbnail",
						room.renderThumbnailImage()).put("price", room.getPrice())
						.put("currencySymbol", room.getCurrency().getSymbol())
						.put("averageRatings", room.getAverageRatings())
						.put("numberOfReviews", room.getNumberOfReviews())
						.set("images", imagesNode);
				roomArray.add(roomNode);
			}
		}

		return roomArray;
	}

	@Transient
	@JsonIgnore
	public static User build(RegisterDTO registerDTO) {
		Sex sex = registerDTO.getSex().equals("MALE") ? Sex.MALE
				: (registerDTO.getSex().equals("FEMALE") ? Sex.FEMALE : Sex.OTHER);

		return User.builder().firstName(registerDTO.getFirstName()).lastName(registerDTO.getLastName())
				.email(registerDTO.getEmail()).password(registerDTO.getPassword()).sex(sex)
				.birthday(registerDTO.getBirthday()).phoneNumber(registerDTO.getPhoneNumber()).role(new Role(1))
				.identityVerified(false).phoneVerified(false)
				.emailVerified(false)
				.build();
	}

	@Transient
	public void addToWishLists(Room room) {
		this.favRooms.add(room);
	}

	@Transient
	public void removeFromWishLists(Room room) {
		this.favRooms.remove(room);
	}

	public boolean hasRole(String role) {
		if (role.equals(this.getRole().getName())) {
			return true;
		}

		return false;
	}
}
