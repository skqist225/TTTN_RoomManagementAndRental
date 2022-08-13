package com.airtnt.airtntapp.user;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.country.CountryRepository;
import com.airtnt.airtntapp.exception.DuplicatedEntryPhoneNumberExeption;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.exception.VerifiedUserException;
import com.airtnt.entity.Country;
import com.airtnt.entity.Role;
import com.airtnt.entity.User;

@Service
@Transactional
public class UserService {
	public static final int USERS_PER_PAGE = 10;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public Page<User> getAllUsers(int pageNumber, String keyword) {
		Pageable pageable = PageRequest.of(pageNumber - 1, USERS_PER_PAGE);
		return userRepository.findAll(keyword, pageable);
	}

	public void encodePassword(User user) {
		String encodedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
	}

	public String getEncodedPassword(String rawPassword) {
		return passwordEncoder.encode(rawPassword);
	}

	public boolean isPasswordMatch(String rawPass, String hashPass) {
		return passwordEncoder.matches(rawPass, hashPass);
	}

	public void registerUser(User user) {
		user.setRole(new Role(2));
		encodePassword(user);
		userRepository.save(user);
	}

	public boolean isEmailUnique(Integer id, String email) {
		Optional<User> user = userRepository.findByEmail(email);

		if (user.isPresent()) {
			return false;
		}

		boolean isCreatingNew = (id == null);

		if (isCreatingNew) { // create
			if (user != null)
				return false;
		} else { // edit
			if (user.get().getId() != id) {
				return false;
			}
		}

		return true;
	}

	public boolean isEmailDuplicated(String email) {
		Optional<User> user = userRepository.findByEmail(email);

		if (user.isPresent()) {
			return true;
		}

		return false;
	}

	public User findByEmail(String email) throws UserNotFoundException {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
		return user;
	}

	public User findByPhoneNumber(String phoneNumber) throws UserNotFoundException {
		User user = userRepository.findByPhoneNumber(phoneNumber)
				.orElseThrow(() -> new UserNotFoundException("User not found with phone number: " + phoneNumber));
		return user;
	}

	@Transactional
	public int verifyPhoneNumber(Integer userId) {
		return userRepository.verifyPhoneNumber(userId);
	}

	public List<User> findAllUsers() {
		return (List<User>) userRepository.findAll();
	}

	public Page<User> listByPage(int pageNum, String sortField, String sortDir, String keyword) {
		Sort sort = Sort.by(sortField);

		sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

		Pageable pageable = PageRequest.of(pageNum - 1, USERS_PER_PAGE, sort);

		if (keyword != null) {
			return userRepository.findAll(keyword, pageable);
		}

		return userRepository.findAll(pageable);
	}

	public User saveUser(User user) {
		return userRepository.save(user);
	}

	public User save(User user) throws DuplicatedEntryPhoneNumberExeption {
		boolean isUpdatingUser = (user.getId() != null);
		if (isUpdatingUser) {
			User existingUser = userRepository.findById(user.getId()).get();

			if (user.getPassword().isEmpty()) {
				user.setPassword(existingUser.getPassword());
			} else {
				encodePassword(user);
			}
		} else {
			Iterator<User> users = userRepository.findAll().iterator();
			while (users.hasNext()) {
				User usr = users.next();
				if (usr.getPhoneNumber().equals(user.getPhoneNumber()))
					throw new DuplicatedEntryPhoneNumberExeption("Phone number has already been taken");
			}

			user.setRole(new Role(2));
			encodePassword(user);
		}

		return userRepository.save(user);
	}

	public List<Country> listCountries() {
		return (List<Country>) countryRepository.findAll();
	}

	public void delete(Integer id) throws UserNotFoundException {
		Long countById = userRepository.countById(id);
		if ((countById == null || countById == 0)) {
			throw new UserNotFoundException("User not found with id: " + id);
		}

		userRepository.deleteById(id);
	}

	public void deleteUser(Integer id)
			throws UserNotFoundException, SQLIntegrityConstraintViolationException, VerifiedUserException {
		User user = this.findById(id);

		if (user.isIdentityVerified()) {
			throw new VerifiedUserException("Can not delete this verified user");
		}

		userRepository.deleteById(id);
	}

	public void updateUserEnabledStatus(Integer id, boolean enabled) {
		userRepository.updateStatus(id, enabled);
	}

	public User findById(Integer id) throws UserNotFoundException {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
		return user;
	}

	public boolean checkEmail(String email) {
		return userRepository.findByEmail(email) != null;
	}

	public Integer getNumberOfUser() {
		return userRepository.getNumberOfUser();
	}
}
