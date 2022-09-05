package com.airtnt.airtntapp.role;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class RoleAdminRestController {
    @Autowired
    RoleService roleService;


    @GetMapping("roles")
    public ResponseEntity<StandardJSONResponse<List<Role>>> findAllRoles() {
        return new OkResponse<>(roleService.findAllRoles()).response();
    }
}
