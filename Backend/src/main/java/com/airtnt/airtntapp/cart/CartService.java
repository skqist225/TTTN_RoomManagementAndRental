package com.airtnt.airtntapp.cart;

import com.airtnt.entity.Cart;
import com.airtnt.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart findByCustomer(User customer){
        return cartRepository.findByCustomer(customer);
    }

    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    public List<Cart> findAll() {
        return (List<Cart>) cartRepository.findAll();
    }
}
