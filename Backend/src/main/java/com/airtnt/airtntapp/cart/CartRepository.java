package com.airtnt.airtntapp.cart;

import com.airtnt.entity.Cart;
import com.airtnt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart,Integer> {

    public Cart findByCustomer(User customer);
}
