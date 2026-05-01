package com.swaraj.fileshare;

import com.swaraj.fileshare.model.FileModel;
import com.swaraj.fileshare.model.FilesModel;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;

@Component
public class DeleteSchedule {

    @Autowired
    private GridFsTemplate gridFsTemplate;
    @Autowired
    FileRepo repo;
//    @Scheduled(fixedRate = 3600000)
//    public void scheduledTask(){
//        List<FileModel> models = repo.findAll();
//        for(FileModel model: models)
//        {
//            Instant createdAt = model.getCreatedAt().toInstant();
//            Instant expiredAt = createdAt.plusSeconds(24*60*60);
//            Instant now = Instant.now();
//            if(now.isAfter(expiredAt))
//            {
//                if (model.getGridFsId() != null) {
//                        gridFsTemplate.delete(new Query(Criteria.where("_id").is(repo.getGridFsId())));
//
//                }
//                repo.delete(model);
//            }
//        }
//    }

    @Autowired
    FilesRepo repoo;
    @Scheduled(fixedRate = 3600000)
    public void scheduledTasks(){
        List<FilesModel> models = repoo.findAll();
        for(FilesModel model: models)
        {
            Instant createdAt = model.getCreatedAt().toInstant();
            Instant expiredAt = createdAt.plusSeconds(24*60*60);
            Instant now = Instant.now();
            if(now.isAfter(expiredAt))
            {
                if (model.getGridFsId() != null) {
                    for (ObjectId fileId : model.getGridFsId()) {
                        gridFsTemplate.delete(new Query(Criteria.where("_id").is(fileId)));
                    }
                }
                repoo.delete(model);
            }
        }
    }
}
