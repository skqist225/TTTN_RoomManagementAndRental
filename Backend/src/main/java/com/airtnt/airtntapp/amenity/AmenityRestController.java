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
import com.airtnt.airtntapp.amenity.dto.PostCreateAmenity;
import com.airtnt.airtntapp.amenity.dto.PostCreateAmenityCategory;
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

    @GetMapping("/amenities/categories/{id}")
    public ResponseEntity<StandardJSONResponse<AmentityCategory>> findAmtCategoryById(@PathVariable("id") Integer id) {
        return new OkResponse<AmentityCategory>(amentityCategorySerivce.findById(id)).response();
    }

    @PostMapping("/amenities/save")
    public ResponseEntity<StandardJSONResponse<Amentity>> saveAmenity(
            @ModelAttribute PostCreateAmenity postCreateAmenity) throws IOException {
        Integer id = postCreateAmenity.getId();
        String name = postCreateAmenity.getName();
        String type = postCreateAmenity.getType();
        MultipartFile multipartFile = postCreateAmenity.getIconImage();
        String description = postCreateAmenity.getDescription();
        Integer amenityCategoryId = postCreateAmenity.getAmenityCategoryId();

        if (amentityService.checkName(id, name).equals("Duplicated")) {
            return new BadResponse<Amentity>("Name is being used by other amenity").response();
        }
        if (name.trim().isEmpty()) {
            return new BadResponse<Amentity>("Name is required").response();
        }
        Amentity amenity = null;
        AmentityCategory amentityCategory = null;
        System.out.println("amenityCategoryId : " + amenityCategoryId);
        if (amenityCategoryId != null) {
            System.out.println("amenityCategoryId : " + amenityCategoryId);
            amentityCategory = amentityCategorySerivce.findById(amenityCategoryId);
        }
        if (id != null) {
            if (amentityCategory != null) {
                amenity = new Amentity(id, name, description, amentityCategory, type);
            } else {
                amenity = new Amentity(id, name, description, type);
            }
        } else {
            if (amenityCategoryId != null) {
                amenity = new Amentity(name, description, amentityCategory, type);
            } else {
                amenity = new Amentity(name, description, type);
            }
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
            System.out.println("abc");
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

    @PostMapping("/amenities/categories/save")
    public ResponseEntity<StandardJSONResponse<AmentityCategory>> saveAmenityCategory(
            @RequestBody PostCreateAmenityCategory postCreateAmenityCategory) throws IOException {
        Integer id = postCreateAmenityCategory.getId();
        String name = postCreateAmenityCategory.getName();
        String description = postCreateAmenityCategory.getDescription();

        if (amentityCategorySerivce.checkName(id, name).equals("Duplicated")) {
            return new BadResponse<AmentityCategory>("Name is being used by other amenities's category").response();
        }
        if (name.trim().isEmpty()) {
            return new BadResponse<AmentityCategory>("Name is required").response();
        }

        AmentityCategory amentityCategory;
        if (id != null) {
            amentityCategory = new AmentityCategory(id, name, description);
        } else {
            if (description != null) {
                amentityCategory = new AmentityCategory(name, description);
            } else {
                amentityCategory = new AmentityCategory(name);
            }
        }
        AmentityCategory savedRule = amentityCategorySerivce.save(amentityCategory);
        return new OkResponse<AmentityCategory>(savedRule).response();

    }

    @DeleteMapping("/amenities/{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<String>(amentityService.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @DeleteMapping("/amenities/categories/{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> deleteAmtCategory(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<String>(amentityCategorySerivce.deleteById(id)).response();
        } catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PostMapping("/rules/check_name")
    public String checkName(@Param("id") Integer id, @Param("name") String name) {
        return amentityService.checkName(id, name);
    }
}
