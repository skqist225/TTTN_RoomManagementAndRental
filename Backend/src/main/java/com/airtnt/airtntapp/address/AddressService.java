package com.airtnt.airtntapp.address;

import com.airtnt.entity.Address;
import com.airtnt.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public Address findByStreetAndCity(String street, City city) {
        return addressRepository.findByStreetAndCity(street,city);
    }

    public Address findById(int id) {
        return addressRepository.findById(id);
    }

    public Address save(Address address) {
        return addressRepository.save(address);
    }
}
