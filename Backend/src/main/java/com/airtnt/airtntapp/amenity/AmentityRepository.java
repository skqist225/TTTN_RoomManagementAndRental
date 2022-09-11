package com.airtnt.airtntapp.amenity;

import java.util.List;

import com.airtnt.entity.Amentity;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmentityRepository extends CrudRepository<Amentity, Integer> {
    public Amentity findByName(String name);

    @Query(value = "SELECT * FROM `airtnt`.`amentities` LIMIT 18;", nativeQuery = true)
    public List<Amentity> getFirst18Amentities();

}
