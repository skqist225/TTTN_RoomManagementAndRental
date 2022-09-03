package com.airtnt.airtntapp.manage_room;

import com.airtnt.airtntapp.room.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ManageRestController {

    @Autowired
    private RoomService roomService;

    @PostMapping(value = "/manage-your-space/update/{roomId}/{fieldName}")
    public String getMethodName(@PathVariable("roomId") Integer roomId, @PathVariable("fieldName") String fieldName,
            @RequestBody Map<String, Object> payload) {
        Map<String, String> values = new HashMap<>();
        
        System.out.println("updated fields: " + fieldName);

        switch (fieldName) {
            case "roomInfo":
                values.put("guestCount", payload.get("guest").toString());
                values.put("bedroomCount", payload.get("bedroom").toString());
                values.put("bedCount", payload.get("bed").toString());
                values.put("bathroomCount", payload.get("bathroom").toString());
                break;
            case "categoryAndPrivacy":
                values.put("category", payload.get("category").toString());
                values.put("roomPrivacy", payload.get("roomPrivacy").toString());
                break;
            case "location":
                values.put("city", payload.get("city").toString());
                values.put("street", payload.get("street").toString());
                values.put("longitude", payload.get("longitude").toString());
                values.put("latitude", payload.get("latitude").toString());
                break;
            case "status":
                values.put("status", payload.get("status").toString());
                break;
            case "amenities":
                values.put("checked", payload.get("checked").toString());
                break;
            case "thumbnail":
                values.put("thumbnail", payload.get("thumbnail").toString());
                break;
            case "price":
                values.put("price", payload.get("price").toString());
                break;
            default:
                values.put(fieldName, payload.get(fieldName).toString());
                break;
        }

        return roomService.updateField(roomId, fieldName, values);
    }
}
