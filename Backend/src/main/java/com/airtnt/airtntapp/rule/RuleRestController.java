package com.airtnt.airtntapp.rule;


import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.Rule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RuleRestController {

    @Autowired
    RuleService ruleService;

    @GetMapping("rules")
    public ResponseEntity<StandardJSONResponse<List<Rule>>> getRules() {
        return new OkResponse<List<Rule>>(ruleService.listAll()).response();
    }
}
