package com.airtnt.airtntapp.amenity.category;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.AmentityCategory;

@Repository
public interface AmentityCategoryRepository extends CrudRepository<AmentityCategory, Integer> {

}
