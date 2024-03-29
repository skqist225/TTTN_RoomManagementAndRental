package com.airtnt.airtntapp.role;


import com.airtnt.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    public List<Role> findAllRoles() {
        return (List<Role>) roleRepository.findAll();
    }
}
