package com.airtnt.airtntapp.address;

import com.airtnt.entity.Address;

import com.airtnt.entity.City;
import org.springframework.data.repository.CrudRepository;

public interface AddressRepository extends CrudRepository<Address, Integer> {
    Address findById(int id);

    Address findByStreetAndCity(String street, City city);
}
