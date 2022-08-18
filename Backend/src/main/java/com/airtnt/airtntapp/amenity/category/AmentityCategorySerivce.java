package com.airtnt.airtntapp.amenity.category;

import java.util.List;

import com.airtnt.entity.AmentityCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AmentityCategorySerivce {
    @Autowired
    AmentityCategoryRepository repo;

    public List<AmentityCategory> listAll() {
        return (List<AmentityCategory>) repo.findAll();
    }
    public AmentityCategory findById(Integer id) {
        return repo.findById(id).get();
    }

}
