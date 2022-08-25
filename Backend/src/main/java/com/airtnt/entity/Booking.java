package com.airtnt.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {
	@ManyToOne
	@JoinColumn(name = "customer_id", nullable = false)
	private User customer;

	@Builder.Default
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "booking")
	private Set<BookingDetail> bookingDetails = new HashSet<>();

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime bookingDate;

	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDateTime cancelDate;

	@Column(columnDefinition = "Decimal(20,2) default '0.00'")
	private float refundPaid;

	@Enumerated(EnumType.STRING)
	private Status state;

	private String clientMessage;

	public Booking(Integer bookingId) {
		super(bookingId);
	}

	@Transient
	public Integer getNumberOfBookingDetails() {
		return this.bookingDetails.size();
	}

	@Transient
	public float getTotalFee() {
		return this.bookingDetails.stream().reduce(0f, (subtotal, bookingDetail) -> {
			return subtotal + bookingDetail.getTotalFee();
		}, Float::sum);
	}

	@Transient
	public Date getMinCheckinDate() {
		Date min = this.getBookingDetails().iterator().next().getCheckinDate();

		for(BookingDetail bookingDetail : this.getBookingDetails()) {
			Date date = bookingDetail.getCheckinDate();
			if(min.compareTo(date) > 0 ) {
				min = date;
			}
		}

		return min;
	}

	@Transient
	public Status determineStatus() {
		Date now = new Date();

		if(Objects.equals(this.state, Status.PENDING)) {
			if(now.compareTo(getMinCheckinDate()) > 0) {
				return Status.OUTOFDATE;
			}
		}

		return this.getState();
	}
}
