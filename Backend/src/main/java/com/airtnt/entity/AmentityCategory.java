package com.airtnt.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "amentity_categories")
public class AmentityCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(unique = true, nullable = false)
	private String name;

	private String description;

	public AmentityCategory(int id) {
		this.id = id;
	}
	
	public AmentityCategory (String name) {
		this.name = name;
	}

	public AmentityCategory (String name, String description) {
		this.name = name;
		this.description = description;
	}
	
	

}
