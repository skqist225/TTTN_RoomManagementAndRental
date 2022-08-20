package com.airtnt.airtntapp.room.privacy;

import java.util.List;

import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.airtntapp.exception.NotFoundException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.entity.RoomPrivacy;

import com.airtnt.entity.Rule;
import com.airtnt.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class RoomPrivacyService {

    private final String DELETE_SUCCESSFULLY="Delete Privacy Successfully";
    private final String DELETE_FORBIDDEN="Could not delete this privacy as it's being used by rooms";

    @Autowired
    private RoomPrivacyRepository roomPrivacyRepository;

    public List<RoomPrivacy> listAll() {
        return (List<RoomPrivacy>) roomPrivacyRepository.findAll();
    }

    public RoomPrivacy save(RoomPrivacy privacy) {
        return roomPrivacyRepository.save(privacy);
    }


    public RoomPrivacy findById(Integer id) throws NotFoundException {
        RoomPrivacy roomPrivacy = roomPrivacyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Could not find privacy with id : " + id));
        return roomPrivacy;
    }
    public RoomPrivacy update(Integer privacyId, PostAddRoomPrivacyDTO postAddRoomPrivacyDTO) throws NotFoundException {
            RoomPrivacy roomPrivacy = findById(privacyId);
            roomPrivacy.setName(postAddRoomPrivacyDTO.getName());
            roomPrivacy.setDescription(postAddRoomPrivacyDTO.getDescription());

            return save(roomPrivacy);
    }

    public String delete(Integer privacyId) throws ConstrainstViolationException {
        try {
            roomPrivacyRepository.deleteById(privacyId);
            System.out.println("hello world");
            return DELETE_SUCCESSFULLY;
        }catch(Exception ex) {
            throw new ConstrainstViolationException(DELETE_FORBIDDEN);
        }
    }

    public String checkName(Integer id, String name) {
        RoomPrivacy roomPrivacy = roomPrivacyRepository.findByName(name);

        if (roomPrivacy == null) {
            return "OK";
        }

        if (id != null && roomPrivacy.getId() == id) {
            return "OK";
        }

        return "Duplicated";
    }
}
