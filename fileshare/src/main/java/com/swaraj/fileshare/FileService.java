package com.swaraj.fileshare;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.swaraj.fileshare.model.FileModel;
import com.swaraj.fileshare.model.FilesModel;
import org.apache.commons.codec.digest.DigestUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class FileService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    FileRepo repo;

    @Autowired
    FilesRepo repoo;

    @Autowired
    Code gen_code;

    public FileModel addFiles(MultipartFile file)throws IOException{
        ObjectId id = gridFsTemplate.store(file.getInputStream(),file.getOriginalFilename(),file.getContentType());
        FileModel model = new FileModel();
        model.setCode(gen_code.code_generate());
        model.setFilename(file.getOriginalFilename());
        model.setGridFsId(id);
        model.setCreatedAt(new Date());
        repo.save(model);
        return model;
    }
    public String addMultiFiles(MultipartFile[] files)throws IOException{
        List<String> FileNames = new ArrayList<>();
        List<ObjectId> ids = new ArrayList<>();
        for(MultipartFile file: files){
            if(!file.isEmpty()){
                ObjectId id = gridFsTemplate.store(file.getInputStream(),file.getOriginalFilename(),file.getContentType());
                FileNames.add(file.getOriginalFilename());
                ids.add(id);
            }
        }

        FilesModel model = new FilesModel();
        String code = gen_code.code_generate();

        String result = DigestUtils.sha256Hex(code);
        model.setPasswordReq(false);
        model.setCode(result);
        model.setFilename(FileNames);
        model.setGridFsId(ids);
        model.setCreatedAt(new Date());
        repoo.save(model);
        return code;
    }
    public String addMultiFilesS(MultipartFile[] files,String pass)throws IOException{
        List<String> FileNames = new ArrayList<>();
        List<ObjectId> ids = new ArrayList<>();
        for(MultipartFile file: files){
            if(!file.isEmpty()){
                ObjectId id = gridFsTemplate.store(file.getInputStream(),file.getOriginalFilename(),file.getContentType());
                FileNames.add(file.getOriginalFilename());
                ids.add(id);
            }
        }

        FilesModel model = new FilesModel();
        String code = gen_code.code_generate();
        String result = DigestUtils.sha256Hex(code);
        model.setCode(result);
        model.setPasswordReq(true);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encPass = encoder.encode(pass);
        model.setPassword(encPass);
        model.setFilename(FileNames);
        model.setGridFsId(ids);
        model.setCreatedAt(new Date());
        repoo.save(model);
        return code;
    }
    public InputStream getFiles(String code)throws IllegalStateException,IOException{
        FileModel model = repo.findByCode(code);
        if(model==null)throw new RuntimeException("File not found");

        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(model.getGridFsId())));
        return gridFsTemplate.getResource(file).getInputStream();
    }
    public List<InputStream> getMultiFiles(String code)throws IllegalStateException,IOException{

        FilesModel model = repoo.findByCode(code);
        if(model==null)throw new RuntimeException("File not found");
        List<ObjectId> ids = model.getGridFsId();
        List<InputStream> files = new ArrayList<>();
        for(ObjectId id: ids)
        {
            GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
            files.add(gridFsTemplate.getResource(file).getInputStream());
        }

        return files;
    }
}
