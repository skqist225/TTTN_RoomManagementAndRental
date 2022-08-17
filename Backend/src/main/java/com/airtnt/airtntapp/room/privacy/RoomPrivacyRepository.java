package com.airtnt.airtntapp.room.privacy;

import com.airtnt.entity.RoomPrivacy;

import com.airtnt.entity.Rule;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomPrivacyRepository extends CrudRepository<RoomPrivacy, Integer> {
    public RoomPrivacy findByName(String name);
}
