package com.airtnt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "addresses")
public class Address {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	@JoinColumn(name = "city_id")
	private City city;

	@Column(name = "apartment_no_street")
	private String street;

	@JsonIgnore
	@OneToOne(mappedBy = "address")
	private User user;

	public Address(City city, String street) {
		this.city = city;
		this.street = street;
	}
}
