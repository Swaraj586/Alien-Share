package com.swaraj.fileshare.controller;

import com.swaraj.fileshare.FileRepo;
import com.swaraj.fileshare.FileService;
import com.swaraj.fileshare.FilesRepo;
import com.swaraj.fileshare.model.FileModel;
import com.swaraj.fileshare.model.FilesModel;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.swing.filechooser.FileView;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@CrossOrigin(origins = "http://localhost:5173",exposedHeaders = "Content-Disposition")
@RestController
public class FileController {

    @Autowired
    FileRepo repo;

    @Autowired
    FilesRepo repoo;

    @Autowired
    private FileService fileService;

    @GetMapping("/getfiles")
    public List<FileModel> getFiles(){
        return repo.findAll();
    }

    @PostMapping("/addfile")
    public FileModel addFiles(@RequestBody FileModel files){
        return repo.save(files);

    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFiles(@RequestParam("file")MultipartFile file)
    {
        try {
            FileModel fm = fileService.addFiles(file);
            String code = fm.getCode();

            return ResponseEntity.ok(code);
        }catch (IOException e){
            return ResponseEntity.status(500).body("Upload failed");
        }
    }
    @PostMapping("/uploadM")
    public ResponseEntity<String> uploadFiles(@RequestParam("file")MultipartFile[] file, @RequestParam(required = false) String password)
    {
        try {
//
            String code;
            if(password!=null)
            {
                code = fileService.addMultiFilesS(file,password);
            }
            else{
                code = fileService.addMultiFiles(file);
            }

            return ResponseEntity.ok(code);
        }catch (IOException e){
            return ResponseEntity.status(500).body("Upload failed");
        }
    }
    @GetMapping("/download/{code}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String code, HttpServletResponse response) {
        try {
            FileModel model = repo.findByCode(code);
            InputStream inputStream = fileService.getFiles(code);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" + model.getFilename()+"\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(inputStream));
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/downloadM/{code}")
    public void downloadMultiFile(@PathVariable String code,@RequestParam(required = false) String password, HttpServletResponse response) {
        try {
            String result = DigestUtils.sha256Hex(code);
            FilesModel model = repoo.findByCode(result);

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if(model.getPasswordReq()){
                if(password==null){
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Missing password.");
                    return;
                }
                if(!encoder.matches(password, model.getPassword())){
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid password.");
                    return;
                }
            }
            List<InputStream> inputStream = fileService.getMultiFiles(result);
            List<String> filenames = model.getFilename();
            response.setContentType("application/zip");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"files_" + code + ".zip\"");

            try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
                for (int i = 0; i < inputStream.size(); i++) {
                    ZipEntry zip = new ZipEntry(filenames.get(i));
                    zipOut.putNextEntry(zip);

                    byte[] bytes = new byte[1024];
                    int length;
                    while ((length = inputStream.get(i).read(bytes)) >= 0) {
                        zipOut.write(bytes, 0, length);
                    }
                    zipOut.closeEntry();
                    inputStream.get(i).close();
                }
                zipOut.finish();
                zipOut.flush();
            }
        }catch (IOException e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }


    }


}
