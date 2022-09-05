package com.airtnt.airtntapp.host;

import com.airtnt.airtntapp.FileUploadUtil;
import com.airtnt.airtntapp.common.GetResource;
import com.airtnt.airtntapp.exception.RoomNotFoundException;
import com.airtnt.airtntapp.room.RoomService;
import com.airtnt.entity.Image;
import com.airtnt.entity.Room;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@RestController
@RequestMapping("/api/become-a-host/")
public class HostRestController {

    public final String PROD_STATIC_PATH = "/opt/tomcat/webapps/ROOT/WEB-INF/classes/static/room_images";
    private final String DEV_STATIC_PATH = "src/main/resources/static/room_images";
    private final String STATIC_ICONS_PATH = "src/main/resources/static/";
    @Autowired
    private RoomService roomService;

    @Value("${env}")
    private String environment;

    public String getUploadDir(String environment, PhotoDTO payload) throws IOException {
        String uploadDir = "", filePath = "", shortFilePath = "";

        if (environment.equals("development")) {
            if (Objects.nonNull(payload.getRoomId())) {
                uploadDir = String.format("%s/%s/%s/", DEV_STATIC_PATH, payload.getHost(), payload.getRoomId());
                FileUploadUtil.cleanDir(uploadDir);
            } else {
                uploadDir = String.format("%s/%s/", DEV_STATIC_PATH, payload.getHost());
            }
        } else {
            if (payload.getRoomId() != null) {
                filePath = String.format("%s/%s/%s/", PROD_STATIC_PATH, payload.getHost(), payload.getRoomId());
                FileUploadUtil.cleanDir(uploadDir);

                shortFilePath = String.format("%s/%s/%s/", "static/room_images/", payload.getHost(), payload.getRoomId());
            } else {
                filePath = String.format("%s/%s/", PROD_STATIC_PATH, payload.getHost());
                shortFilePath = String.format("%s/%s/", "static/room_images/", payload.getHost());
            }

            Path uploadPath = Paths.get(filePath);
            if (!Files.exists(uploadPath)) {
                Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rwxr--r--");
                FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions
                        .asFileAttribute(permissions);

                Files.createDirectories(uploadPath, fileAttributes);
            }
            uploadDir = GetResource.getResourceAsFile(shortFilePath);
        }

        return uploadDir;
    }

    @PostMapping("upload-room-photos")
    public String uploadRoomPhotos(@ModelAttribute PhotoDTO payload) throws IOException {

        String uploadDir = getUploadDir(environment, payload);
        System.out.println(uploadDir);

        for (MultipartFile multipartFile : payload.getPhotos()) {
            if (!multipartFile.isEmpty()) {
                String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
            }
        }

        JSONObject object = new JSONObject();
        object.put("status", "success");
        object.put("username", payload.getHost());

        return object.toString();
    }

    @PostMapping("update/upload-room-photos")
    public String updatedUploadRoomPhotos(@ModelAttribute PhotoDTO payload) throws IOException, NumberFormatException, RoomNotFoundException {
        String uploadDir = !payload.getHost().equals("test@gmail.com")
                ? DEV_STATIC_PATH + "/" + payload.getHost() + "/" + payload.getRoomId()
                : DEV_STATIC_PATH + "/" + payload.getHost();
        // FileUploadUtil.cleanDir(uploadDir);

        Set<Image> newImages = new HashSet<>();
        for (MultipartFile multipartFile : payload.getPhotos()) {
            if (!multipartFile.isEmpty()) {
                String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                newImages.add(new Image(fileName));
                FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
            }
        }
        // do not assign new set // get new set and push it to old set
        Room room = roomService.findById(Integer.parseInt(payload.getRoomId()));
        room.getImages().clear();
        for (Image i : newImages) {
            room.getImages().add(i);
        }

        try {
            roomService.save(room);
            return new JSONObject().put("status", "success").toString();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return new JSONObject().put("status", "fail").toString();
    }

    @PostMapping("get-upload-photos")
    public String getUploadPhoto(@ModelAttribute PhotoDTO payload)
            throws IOException {
        String[] roomImages = payload.getRoomImages();
        String uploadDir = getUploadDir(environment, payload);

        List<MultipartFile> multipartFiles = new ArrayList<>();

        String contentType = "text/plain";
        Path path = Paths.get(uploadDir);
        for (String image : roomImages) {
            Path fullPath = path.resolve(image);

            System.out.println(image);

            byte[] content = null;
            try {
                content = Files.readAllBytes(fullPath);

                MultipartFile result = new MockMultipartFile(image, image, contentType, content);
                multipartFiles.add(result);
            } catch (final IOException ignored) {
            }
        }
        JSONObject object = new JSONObject();
        object.put("status", "success");
        object.put("roomImages", multipartFiles);
        System.out.println(multipartFiles.toString());

        return object.toString();
    }

    @PostMapping("get-upload-icons")
    public String getUploadIcons(@RequestParam(name = "folderName") String folderName,
                                 @RequestParam(name = "iconName") String iconName)
            throws IOException {
        String uploadDir = STATIC_ICONS_PATH + folderName + "/";

        System.out.println(uploadDir);

        List<MultipartFile> multipartFiles = new ArrayList<>();

        String contentType = "text/plain";
        Path path = Paths.get(uploadDir);
        Path fullPath = path.resolve(iconName);

        byte[] content = null;
        try {
            content = Files.readAllBytes(fullPath);

            MultipartFile result = new MockMultipartFile(iconName, iconName, contentType, content);
            multipartFiles.add(result);
        } catch (final IOException ignored) {
        }

        JSONObject object = new JSONObject();
        object.put("status", "success");
        object.put("roomImages", multipartFiles);
        System.out.println(multipartFiles.toString());

        return object.toString();
    }
}
