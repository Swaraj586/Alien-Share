package com.swaraj.fileshare;

import com.swaraj.fileshare.model.FileModel;
import com.swaraj.fileshare.model.FilesModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;

@Component
public class DeleteSchedule {


    @Autowired
    FileRepo repo;
    @Scheduled(fixedRate = 3600000)
    public void scheduledTask(){
        List<FileModel> models = repo.findAll();
        for(FileModel model: models)
        {
            Instant createdAt = model.getCreatedAt().toInstant();
            Instant expiredAt = createdAt.plusSeconds(24*60*60);
            Instant now = Instant.now();
            if(now.isAfter(expiredAt))
            {
                repo.delete(model);
            }
        }
    }

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
                repoo.delete(model);
            }
        }
    }
}
