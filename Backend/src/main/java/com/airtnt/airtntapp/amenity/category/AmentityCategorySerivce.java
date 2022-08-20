package com.airtnt.airtntapp.amenity.category;

import java.util.List;

import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.entity.AmentityCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AmentityCategorySerivce {
    private final String DELETE_SUCCESSFULLY = "Delete Amenity Category Successfully";
    private final String DELETE_FORBIDDEN = "Could not delete this amenity category as it's being used by rooms";

    @Autowired
    AmentityCategoryRepository repo;

    public List<AmentityCategory> listAll() {
        return (List<AmentityCategory>) repo.findAll();
    }

    public AmentityCategory findById(Integer id) {
        return repo.findById(id).get();
    }

    public AmentityCategory save(AmentityCategory amentityCategory) {
        return repo.save(amentityCategory);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            repo.deleteById(id);
            return DELETE_SUCCESSFULLY;
        } catch (Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public String checkName(Integer id, String name) {
        AmentityCategory rule = repo.findByName(name);

        if (rule == null)
            return "OK";

        if (id != null && rule.getId() == id)
            return "OK";

        return "Duplicated";
    }
}
