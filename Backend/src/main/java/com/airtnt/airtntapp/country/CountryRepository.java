package com.airtnt.airtntapp.country;

import com.airtnt.entity.Country;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryRepository extends CrudRepository<Country, Integer> {
    public List<Country> findALLByOrderByNameAsc();

    public Country findByName(String name);

    @Query("SELECT new Country(c.id, c.name, c.code, c.dialCode) FROM Country c WHERE c.status = true")
    public List<Country> getCountriesWithoutStates();
}
