package com.airtnt.airtntapp.room.privacy;

import java.util.List;

import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.airtntapp.exception.NotFoundException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.RoomPrivacy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
public class RoomPrivacyRestController {
    @Autowired
    private RoomPrivacyService roomPrivacyService;

    @GetMapping("room-privacy")
    public ResponseEntity<StandardJSONResponse<List<RoomPrivacy>>> getRoomPrivacies() {
        return new OkResponse<List<RoomPrivacy>>(roomPrivacyService.listAll()).response();
    }

    @GetMapping("/admin/room-privacy")
    public ResponseEntity<StandardJSONResponse<List<RoomPrivacy>>> getRoomAdminPrivacies(@RequestParam(value = "page") Integer page) {
        return new OkResponse<List<RoomPrivacy>>(roomPrivacyService.listAll()).response();
    }

    @GetMapping("/admin/room-privacy/{privacyId}")
    public ResponseEntity<StandardJSONResponse<RoomPrivacy>> getPrivacy(@PathVariable(value = "privacyId") Integer privacyId) {
        try {
            return new OkResponse<RoomPrivacy>(roomPrivacyService.findById(privacyId)).response();
        } catch (NotFoundException ex) {
            return new BadResponse<RoomPrivacy>(ex.getMessage()).response();
        }
    }

    @PostMapping("/admin/room-privacy/save")
    public ResponseEntity<StandardJSONResponse<RoomPrivacy>> addRoomPrivacy(@RequestBody PostAddRoomPrivacyDTO postAddRoomPrivacyDTO) {
        if (roomPrivacyService.checkName(null, postAddRoomPrivacyDTO.getName()).equals("Duplicated")) {
            return new BadResponse<RoomPrivacy>("Name is being used by other privacy").response();
        }
        RoomPrivacy roomPrivacy = roomPrivacyService.save(new RoomPrivacy(postAddRoomPrivacyDTO.getName(), postAddRoomPrivacyDTO.getDescription()));
        return new OkResponse<RoomPrivacy>(roomPrivacy).response();
    }

    @PutMapping("/admin/room-privacy/{privacyId}/update")
    public ResponseEntity<StandardJSONResponse<RoomPrivacy>> updateRoomPrivacy(@PathVariable("privacyId") Integer privacyId, @RequestBody PostAddRoomPrivacyDTO postAddRoomPrivacyDTO) {
        try {
            if (roomPrivacyService.checkName(privacyId, postAddRoomPrivacyDTO.getName()).equals("Duplicated")) {
                return new BadResponse<RoomPrivacy>("Name is being used by other privacy").response();
            }
            return new OkResponse<RoomPrivacy>(roomPrivacyService.update(privacyId, postAddRoomPrivacyDTO)).response();
        } catch (NotFoundException ex) {
            return new BadResponse<RoomPrivacy>(ex.getMessage()).response();
        }
    }

    @DeleteMapping("/admin/room-privacy/{privacyId}/delete")
    public ResponseEntity<StandardJSONResponse<String>> deleteRoomPrivacy(@PathVariable("privacyId") Integer privacyId) {
        try {
            return new OkResponse<String>(roomPrivacyService.delete(privacyId)).response();
        }catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }
}
