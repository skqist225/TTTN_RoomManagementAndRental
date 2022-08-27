package com.airtnt.entity;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
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

	public AmentityCategory(Integer id, String name, String description) {
		this.id = id;
		this.name = name;
		this.description = description;
	}
}
