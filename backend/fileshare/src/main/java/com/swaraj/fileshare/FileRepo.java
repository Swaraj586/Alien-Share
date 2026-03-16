package com.swaraj.fileshare;

import com.swaraj.fileshare.model.FileModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileRepo extends MongoRepository<FileModel,String> {

    FileModel findByCode(String code);
}
