package com.airtnt.entity;

import com.airtnt.airtntapp.room.dto.PostAddRoomDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "rooms")
public class Room extends BaseEntity implements Comparable<Room> {

    @Column(nullable = false, length = 512)
    private String name;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id")
    private Set<Image> images = new HashSet<>();
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
    private String thumbnail;
    @Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
    private int bedroomCount;
    @Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
    private int bathroomCount;
    @Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
    private int accomodatesCount;
    @Column(nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
    private int bedCount;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @Column(columnDefinition = "TEXT NOT NULL")
    private String description;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "rooms_amentities", joinColumns = @JoinColumn(name = "room_id"), inverseJoinColumns = @JoinColumn(name = "amentity_id"))
    private Set<Amentity> amentities = new HashSet<>();
    @Column(columnDefinition = "DEFAULT 0")
    private float latitude;
    @Column(columnDefinition = "DEFAULT 0")
    private float longitude;
    @Column(nullable = false)
    private float price;
    @ManyToOne
    @JoinColumn(name = "privacy_id")
    private RoomPrivacy privacyType;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "host_id")
    private User host;
    @JsonIgnore
    @OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE)
    private List<BookingDetail> bookingDetails = new ArrayList<>();
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "rooms_rules", joinColumns = @JoinColumn(name = "room_id"), inverseJoinColumns = @JoinColumn(name = "rule_id"))
    private Set<Rule> rules = new HashSet<>();

    @Builder
    public Room(Integer id, String name, Set<Image> images, String thumbnail, Address address,
                int bedroomCount, int bathroomCount, int accomodatesCount, int bedCount,
                Category category, String description, Set<Amentity> amentities, float latitude, float longitude,
                float price, RoomPrivacy privacyType, User host, Set<Rule> rules, boolean status) {
        super(status);
        this.name = name;
        this.images = images;
        this.thumbnail = thumbnail;
        this.address = address;
        this.bedroomCount = bedroomCount;
        this.bathroomCount = bathroomCount;
        this.accomodatesCount = accomodatesCount;
        this.bedCount = bedCount;
        this.category = category;
        this.description = description;
        this.amentities = amentities;
        this.latitude = latitude;
        this.longitude = longitude;
        this.price = price;
        this.privacyType = privacyType;
        this.host = host;
        this.rules = rules;
    }

    public Room(int id) {
        super(id);
    }

    @Transient
    public static Room build(PostAddRoomDTO payload, Set<Image> images, Set<Amentity> amenities, Address address,
                                 Set<Rule> rules, boolean status) {
        return Room.builder().name(payload.getName()).accomodatesCount(payload.getGuestCount())
                .bathroomCount(payload.getBathroomCount()).bedCount(payload.getBedCount())
                .bedroomCount(payload.getBedroomCount()).description(payload.getDescription()).amentities(amenities)
                .images(images).latitude(payload.getLatitude()).longitude(payload.getLongitude())
                .price(payload.getPrice()).rules(rules).host(new User(payload.getHost()))
                .host(new User(payload.getHost())).category(new Category(payload.getCategory())).privacyType(new RoomPrivacy(payload.getPrivacy()))
                .address(address)
                .thumbnail(images.iterator().next().getImage()).status(true).build();
    }

    @Transient
    public String renderThumbnailImage() {
        if (this.host.getEmail().equals("test@gmail.com")) {
            return String.format("/room_images/%s/%s", this.host.getEmail(), this.thumbnail);
        } else {
            return String.format("/room_images/%s/%s/%s", this.host.getEmail(), this.getId(), this.thumbnail);
        }
    }

    @Transient
    public long calculateHowManyDaysFromPastToCurrent() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate dateBefore = LocalDate.parse(this.getUpdatedDate().toString(), dtf);
        LocalDate currentDate = LocalDate.now();

        return ChronoUnit.DAYS.between(dateBefore, currentDate);
    }

    public void addAmenity(Amentity amentity) {
        this.amentities.add(amentity);
    }

    public void removeAmenity(Amentity amentity) {
        this.amentities.remove(amentity);
    }

    public void addRule(Rule rule) {
        this.rules.add(rule);
    }

    public void removeRule(Rule rule) {
        this.rules.remove(rule);
    }

    public void addImage(Image image) {
        this.images.add(image);
    }

    public void removeImage(Image image) {
        this.images.remove(image);
    }

    @Transient
    public List<String> getImagesPath() {
        return this.getImages().stream().filter(image -> !image.getImage().equals(this.thumbnail)).map(image ->
				image.getImagePath(this.host.getEmail(), this.getId())).collect(Collectors.toList());
    }

    @Transient
    public Float getAverageRatings() {
        if (this.bookingDetails.size() > 0) {
            float totalAverage = this.bookingDetails.stream().reduce(0f,
                    (subtotal, bookingDetail) -> {
                        if (bookingDetail.getReview() != null) {
                            return subtotal + bookingDetail.getAverageRating();
                        }

                        return subtotal;
                    },
                    Float::sum);

            return totalAverage / (float) this.getNumberOfReviews();
        }

        return 0f;
    }

    @Transient
    public Integer getNumberOfReviews() {
        if (this.bookingDetails.size() > 0) {
            return this.bookingDetails.stream().reduce(0, (subtotal, booking) -> {
                if (booking.getReview() != null) {
                    return subtotal + 1;
                }

                return subtotal;
            }, Integer::sum);
        }

        return 0;
    }

    @Override
    public int compareTo(Room o) {
		return Integer.compare(this.getBookingDetails().size(), o.getBookingDetails().size());
    }
}
