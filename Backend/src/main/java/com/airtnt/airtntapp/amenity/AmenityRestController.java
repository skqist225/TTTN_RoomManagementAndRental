package com.airtnt.airtntapp.amenity;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.List;
import java.util.Set;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.amenity.category.AmentityCategorySerivce;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.Amentity;

import com.airtnt.entity.AmentityCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class AmenityRestController {

    @Autowired
    private AmentityService amentityService;

    @Autowired
    private AmentityCategorySerivce amentityCategorySerivce;


    @Autowired
    private Environment env;

    @GetMapping("/amenities")
    public ResponseEntity<StandardJSONResponse<List<Amentity>>> getRoomPrivacies() {
        return new OkResponse<List<Amentity>>(amentityService.listAll()).response();
    }

    @GetMapping("/amenityCategories")
    public ResponseEntity<StandardJSONResponse<List<AmentityCategory>>> getAmenityCategories() {
        return new OkResponse<List<AmentityCategory>>(amentityCategorySerivce.listAll()).response();
    }

    @GetMapping("/amenities/{id}")
    public ResponseEntity<StandardJSONResponse<Amentity>> findById(@PathVariable("id") Integer id) {
        return new OkResponse<Amentity>(amentityService.getById(id)).response();
    }

    @PostMapping("/amenities/save")
    public ResponseEntity<StandardJSONResponse<Amentity>> saveAmentity(@RequestParam(name = "id", required = false) Integer id,
                                                                       @RequestParam("name") String name,
                                                                       @RequestParam(name = "iconImage", required = false) MultipartFile multipartFile,
                                                                       @RequestParam(name = "description", required = false, defaultValue = "") String description,
                                                                       @RequestParam(name = "type", required = false, defaultValue = "") String type,
                                                                       @RequestParam(name = "amentityCategory", required = false, defaultValue = "") Integer amentityCategoryId

    ) throws IOException {
        if (amentityService.checkName(id, name).equals("Duplicated")) {
            return new BadResponse<Amentity>("Name is being used by other amenity").response();
        }
        if (name.trim().isEmpty()) {
            return new BadResponse<Amentity>("Name is required").response();
        }
        Amentity amenity;
        AmentityCategory amentityCategory = amentityCategorySerivce.findById(amentityCategoryId);
        if (id != null)
        {
            amenity = new Amentity(id, name,description,amentityCategory,type);
        }
        else {

            amenity = new Amentity(name,description,amentityCategory, type);
        }

        if (multipartFile != null && !multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            amenity.setIconImage(fileName);

            Amentity savedAmentity = amentityService.save(amenity);
            String uploadDir = "src/main/resources/static/amentity_images/";

            String environment = env.getProperty("env");
            System.out.println(environment);
            if (environment.equals("development")) {
                uploadDir = "src/main/resources/static/amentity_images/";
            } else {
                String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/amentity_images/";
                Path uploadPath = Paths.get(filePath);
                if (!Files.exists(uploadPath)) {
                    Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                    FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                            .asFileAttribute(permissions);

                    Files.createDirectories(uploadPath, fileAttributes);
                }
                uploadDir = GetResource.getResourceAsFile("static/amentity_images/");
                System.out.println(uploadDir);
            }

            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return new OkResponse<Amentity>(savedAmentity).response();
        } else {
            if (id == null) {
                return new BadResponse<Amentity>("Image is required").response();
            }
            Amentity savedAmentity = amentityService.save(amenity);
            return new OkResponse<Amentity>(savedAmentity).response();
        }
    }

    @DeleteMapping("/amenities/{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<String>(amentityService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PostMapping("/rules/check_name")
    public String checkName(@Param("id") Integer id, @Param("name") String name) {
        return amentityService.checkName(id, name);
    }
}
