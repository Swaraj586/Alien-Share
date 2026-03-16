package com.swaraj.fileshare;

import com.swaraj.fileshare.model.FilesModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FilesRepo extends MongoRepository<FilesModel,String> {

    FilesModel findByCode(String code);
}
