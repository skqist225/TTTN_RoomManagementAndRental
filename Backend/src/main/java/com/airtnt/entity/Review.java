package com.airtnt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "bookingDetail" })
@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {
	@JsonIgnore
	@OneToOne(mappedBy = "review")
	private BookingDetail bookingDetail;

	@Column(nullable = false, length = 1024)
	private String comment;

	@Embedded
	private SubRating subRating;
	
	@Transient
	public float getFinalRating() {
		return this.subRating.getFinalRating();
	}
}
