package com.airtnt.airtntapp.cart;


import com.airtnt.airtntapp.cart.dto.PostUpsertCart;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.security.UserDetailsImpl;
import com.airtnt.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/cart")
public class CartRestController {
@Autowired
    private CartService cartService;


    @PostMapping("upsert")
    public ResponseEntity<StandardJSONResponse<String>> upsertCart(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody PostUpsertCart postUpsertCart) {
        User customer = userDetails.getUser();

        return new OkResponse<>("").response();
    }

}
