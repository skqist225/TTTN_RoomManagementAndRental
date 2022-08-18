package com.airtnt.airtntapp.amenity;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.entity.Amentity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AmentityService {
    private final String DELETE_SUCCESSFULLY="Delete Amenity Successfully";
    private final String DELETE_FORBIDDEN="Could not delete this amenity as it's being used by rooms";


    @Autowired
    AmentityRepository amentityRepository;

    public List<Amentity> getAmentities(String findCriteria) {
        List<Amentity> amentities = null;
        if (findCriteria == "prominent") {
            amentities = amentityRepository.findByProminent(true);
        } else if (findCriteria == "favorite") {
            amentities = amentityRepository.findByFavorite(true);
        } else {
            amentities = amentityRepository.findBySafe(true);
        }

        return amentities;
    }

    public List<Amentity> getFirst18Amentities() {
        List<Amentity> amentities = amentityRepository.getFirst18Amentities();

        return amentities;
    }

    public List<Amentity> getAllAmentities() {
        Iterator<Amentity> itr = amentityRepository.findAll().iterator();
        List<Amentity> amentities = new ArrayList<>();

        itr.forEachRemaining(amentities::add);

        return amentities;
    }

    public List<Amentity> listAll() {
        return (List<Amentity>) amentityRepository.findAll();
    }

    public Amentity getById(Integer id) {
        return amentityRepository.findById(id).get();
    }

    public Amentity save(Amentity amentity) {
        if (amentity.getId() != null) {
            Amentity amentityDB = amentityRepository.findById(amentity.getId()).get();
            if (amentity.getIconImage() == null)
                amentity.setIconImage(amentityDB.getIconImage());

            return amentityRepository.save(amentity);
        }
        return amentityRepository.save(amentity);
    }

    public String deleteById(Integer id) throws ConstrainstViolationException {
        try {
            amentityRepository.deleteById(id);
            return DELETE_SUCCESSFULLY;
        }catch(Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public String checkName(Integer id, String name) {
        Amentity amentity = amentityRepository.findByName(name);

        if (amentity == null)
            return "OK";

        if (id != null && amentity.getId() == id)
            return "OK";

        return "Duplicated";
    }
}
