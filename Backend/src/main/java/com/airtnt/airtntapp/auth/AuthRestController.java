package com.airtnt.airtntapp.auth;

import com.airtnt.airtntapp.email.SendEmail;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.jwt.JwtUtils;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.error.ForbiddenResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.security.UserDetailsServiceImpl;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.airtntapp.user.dto.ForgotPasswordResponse;
import com.airtnt.airtntapp.user.dto.RegisterDTO;
import com.airtnt.airtntapp.user.dto.ResetPasswordByPhoneNumberDTO;
import com.airtnt.airtntapp.user.dto.ResetPasswordDTO;
import com.airtnt.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("login")
    public ResponseEntity<StandardJSONResponse<User>> login2(@RequestBody LoginDTO loginDTO,
                                                             @RequestParam(value = "admin", defaultValue = "false") String admin) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));

            final UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(loginDTO.getEmail());
            final String token = jwtUtils.generateToken(userDetails);
            User user = userService.findByEmail(loginDTO.getEmail());
            user.setToken(token);

            if (admin.equals("true") && !user.getRole().getName().equals("Admin")) {
                return new ForbiddenResponse<User>(
                        "Your account does not have enough privileges to access this resource.").response();
            }

            return new OkResponse<User>(user).response();
        } catch (BadCredentialsException e) {
            return new BadResponse<User>(e.getMessage()).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<User>(e.getMessage()).response();
        }
    }

    @GetMapping("logout")
    public ResponseEntity<StandardJSONResponse<String>> logout() {
        return new OkResponse<String>("Log out successfully").response();
    }

    @GetMapping("check-phonenumber/{phoneNumber}")
    public ResponseEntity<StandardJSONResponse<String>> checkUsedPhoneNumber(
            @PathVariable(value = "phoneNumber") String phoneNumber, @RequestParam(name = "edit", required = false) Boolean isEdit, @RequestParam(name = "userId", required = false) Integer userId) {
        if (userService.checkPhoneNumber(phoneNumber, isEdit, userId)) {
            return new BadResponse<String>("Phone number has already been taken").response();
        }

        return new OkResponse<String>("Phone number has not been used by anyone yet").response();
    }

    @GetMapping("check-email/{email}")
    public ResponseEntity<StandardJSONResponse<String>> checkUsedEmail(
            @PathVariable(value = "email") String email, @RequestParam(name = "edit", required = false, defaultValue = "false") Boolean isEdit, @RequestParam(name = "userId", required = false) Integer userId) {
        if (userService.checkEmail(email, isEdit, userId)) {
            return new BadResponse<String>("Email has already been taken").response();
        }

        return new OkResponse<String>("Email has not been used by anyone yet").response();
    }

    @PostMapping("register")
    public ResponseEntity<StandardJSONResponse<User>> registerUser(@Validated @RequestBody RegisterDTO postUser
    ) {
        ArrayNode arrays = objectMapper.createArrayNode();

        if (userService.checkBirthday(postUser.getBirthday())) {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("birthday", "Your age must be greater than 18");
            arrays.add(node);
        }

        if (userService.checkEmail(postUser.getEmail(), false, 0)) {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("email", "Email has already been taken");
            arrays.add(node);
        }

        if (userService.checkPhoneNumber(postUser.getPhoneNumber(), false, 0)) {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("phoneNumber", "Phone number has already been taken");
            arrays.add(node);
        }

        if (postUser.getPhoneNumber().length() != 10) {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("phoneNumberCharacter", "Phone number must be 10 characters");
            arrays.add(node);
        }

        if (arrays.size() > 0) {
            return new BadResponse<User>(arrays.toString()).response();
        }

        return new OkResponse<User>(userService.save(User.build(postUser))).response();
    }

    @PostMapping("forgot-password")
    public ResponseEntity<StandardJSONResponse<ForgotPasswordResponse>> forgotPassword(
            @RequestBody Map<String, String> payLoad) throws MessagingException {
        String email = payLoad.get("email");
        try {
            User user = userService.findByEmail(email);

            String msg = "Hi " + user.getFullName() + "<div>Need to reset your password?</div>" + "</div>"
                    + "<div>Click on the link below and enter the secret code above.</div>"
                    + "<a href='http://localhost:3000/auth/reset-password'>Reset your password</a>"
                    + "<div>If you did not forget your password, you can ignore this email.</div>";

            SendEmail.send(user.getEmail(), "Reset your password - AirJ18", msg);

            Random rand = new Random();
            int resetPasswordCode = rand.nextInt(999999) + 1;

            user.setResetPasswordCode(resetPasswordCode);
            user.setResetPasswordExpirationTime(LocalDateTime.now().plusMinutes(30));
            userService.saveUser(user);

            String message = "Your reset password link has been sent to your email: " + user.getEmail();
            ForgotPasswordResponse forgotPasswordResponse = new ForgotPasswordResponse(resetPasswordCode, message,
                    email);

            return new OkResponse<ForgotPasswordResponse>(forgotPasswordResponse).response();
        } catch (UserNotFoundException e) {
            return new BadResponse<ForgotPasswordResponse>(e.getMessage()).response();
        }
    }

    @PutMapping("reset-password")
    public ResponseEntity<StandardJSONResponse<String>> resetPassword(@RequestBody ResetPasswordDTO resetPassword) {
        if (resetPassword.getEmail().isEmpty()) {
            return new BadResponse<String>("Email is required to reset password. Discard reset password session.")
                    .response();
        }
        int resetPasswordCode = resetPassword.getResetPasswordCode();
        String email = resetPassword.getEmail();
        String newPassword = resetPassword.getNewPassword();
        String confirmNewPassword = resetPassword.getConfirmNewPassword();
        LocalDateTime now = LocalDateTime.now();

        try {
            User user = userService.findByEmail(email);

            if (resetPasswordCode != user.getResetPasswordCode())
                return new BadResponse<String>("Invalid reset code").response();

            boolean isAfter = now.isAfter(user.getResetPasswordExpirationTime());
            if (isAfter)
                return new BadResponse<String>("Reset password session is out of time").response();

            if (!newPassword.equals(confirmNewPassword))
                return new BadResponse<String>("New password does not match confirm new password").response();

            user.setPassword(userService.getEncodedPassword(newPassword));
            user.setResetPasswordExpirationTime(null);
            user.setResetPasswordCode(null);
            userService.saveUser(user);

            return new OkResponse<String>("Your password has been changed successfully").response();
        } catch (UserNotFoundException e) {
            e.printStackTrace();
            return new BadResponse<String>(e.getMessage()).response();
        }
    }

    @PutMapping("reset-password-by-phonenumber")
    public ResponseEntity<StandardJSONResponse<String>> resetPassword(
            @RequestBody ResetPasswordByPhoneNumberDTO resetPassword) {
        if (resetPassword.getPhone().isEmpty()) {
            return new BadResponse<String>(
                    "Phone number is required to reset password. Discard reset password session.").response();
        }

        String phoneNumber = resetPassword.getPhone();
        String newPassword = resetPassword.getNewPassword();
        String confirmNewPassword = resetPassword.getConfirmNewPassword();

        try {
            User user = userService.findByPhoneNumber(phoneNumber);

            if (!newPassword.equals(confirmNewPassword))
                return new BadResponse<String>("New password does not match confirm new password").response();

            user.setPassword(userService.getEncodedPassword(newPassword));
            user.setResetPasswordExpirationTime(null);
            userService.saveUser(user);

            return new OkResponse<String>("Your password has been changed successfully").response();
        } catch (UserNotFoundException e) {
            e.printStackTrace();
            return new BadResponse<String>(e.getMessage()).response();
        }
    }
}
