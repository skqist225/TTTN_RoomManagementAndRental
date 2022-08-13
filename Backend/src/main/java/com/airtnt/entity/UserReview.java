package com.airtnt.entity;

import java.text.SimpleDateFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_reviews")
public class UserReview extends BaseEntity {
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "host_id")
	User host;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "reviewer_id")
	User reviewer;

	@Column(name = "review", columnDefinition = "TEXT")
	private String review;

	@Transient
	public ObjectNode getReviewerInfo() throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode objectNode = mapper.createObjectNode();

		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		String joinDate = sdf.format(this.reviewer.getCreatedDate());

		if (this.reviewer != null) {
			objectNode.put("fullName", this.reviewer.getFullName()).put("avatar", this.reviewer.getAvatarPath())
					.put("joinDate", joinDate);
		}

		return objectNode;
	}
}
