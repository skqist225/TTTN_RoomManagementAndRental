package com.airtnt.airtntapp.rule;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.airtntapp.exception.ConstrainstViolationException;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.entity.Rule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminRuleRestController {
    @Autowired
    RuleService ruleService;

    @Autowired
    private Environment env;

    @GetMapping("/rules/{id}")
    public ResponseEntity<StandardJSONResponse<Rule>> findById(@PathVariable("id") Integer id) {
        return new OkResponse<Rule>(ruleService.getById(id)).response();
    }

    @PostMapping("/rules/save")
    public ResponseEntity<StandardJSONResponse<Rule>> saveRule(@RequestParam(name = "id", required = false) Integer id,
            @RequestParam("name") String name,
            @RequestParam(name = "ruleImage", required = false) MultipartFile multipartFile,
            @RequestParam(name = "status",required = false, defaultValue = "true") Boolean status) throws IOException {
        if (ruleService.checkName(id, name).equals("Duplicated")) {
            return new BadResponse<Rule>("Name is being used by other rule").response();
        }
        if (name.trim().isEmpty()) {
            return new BadResponse<Rule>("Name is required").response();
        }
        Rule rule;
        if (id != null)
            rule = new Rule(id, name);
        else
            rule = new Rule(name);
        rule.setStatus(status);
        if (multipartFile != null && !multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            rule.setIcon(fileName);

            Rule savedRule = ruleService.save(rule);
            String uploadDir = "src/main/resources/static/rule_images/";

            String environment = env.getProperty("env");
            System.out.println(environment);
            if (environment.equals("development")) {
                uploadDir = "src/main/resources/static/rule_images/";
            } else {
                String filePath = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/rule_images/";
                Path uploadPath = Paths.get(filePath);
                if (!Files.exists(uploadPath)) {
                    Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                    FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                            .asFileAttribute(permissions);

                    Files.createDirectories(uploadPath, fileAttributes);
                }
                uploadDir = GetResource.getResourceAsFile("static/rule_images/");
                System.out.println(uploadDir);
            }

            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            return new OkResponse<Rule>(savedRule).response();
        } else {
            if (id == null) {
                return new BadResponse<Rule>("Image is required").response();
            }
            Rule savedRule = ruleService.save(rule);
            return new OkResponse<Rule>(savedRule).response();
        }
    }

    @DeleteMapping("/rules/{id}/delete")
    public ResponseEntity<StandardJSONResponse<String>> delete(@PathVariable("id") Integer id) {
        try {
            return new OkResponse<String>(ruleService.deleteById(id)).response();
        }catch (ConstrainstViolationException ex) {
            return new BadResponse<String>(ex.getMessage()).response();
        }
    }

    @PostMapping("/rules/check_name")
    public String checkName(@Param("id") Integer id, @Param("name") String name) {
        return ruleService.checkName(id, name);
    }
}
