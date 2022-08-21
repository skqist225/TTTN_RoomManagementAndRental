package com.airtnt.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "carts")
public class Cart extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "customer_id")
    User customer;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    Booking booking;
}
