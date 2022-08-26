package com.airtnt.airtntapp.city;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.City;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CityRestController {
    @Autowired
    private CityService cityService;

    @GetMapping("/cities/state/{stateId}")
    public ResponseEntity<StandardJSONResponse<List<City>>> fetchCitiesByState(@PathVariable Integer stateId) {
        return new OkResponse<List<City>>(cityService.fetchCitiesByState(stateId)).response();
    }

    @GetMapping("/cities")
    public ResponseEntity<StandardJSONResponse<List<City>>> fetchCities() {
        return new OkResponse<List<City>>(cityService.listAll()).response();
    }
}
