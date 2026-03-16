package com.swaraj.fileshare.model;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.OffsetDateTime;
import java.util.Date;

@Document(collection = "files")
public class FileModel {
    private String id;
    private String code;
    private String filename;
    private ObjectId gridFsId;
    private Date createdAt;



    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ObjectId getGridFsId() {
        return gridFsId;
    }

    public void setGridFsId(ObjectId gridFsId) {
        this.gridFsId = gridFsId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }




}
