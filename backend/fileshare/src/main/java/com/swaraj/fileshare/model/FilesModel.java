package com.swaraj.fileshare.model;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

@Document(collection = "filess")
public class FilesModel {
    private String id;
    private String code;
    private List<String> filename;
    private List<ObjectId> gridFsId;
    private Date createdAt;
    private Boolean passwordReq;
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getPasswordReq() {
        return passwordReq;
    }

    public void setPasswordReq(Boolean passwordReq) {
        this.passwordReq = passwordReq;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getFilename() {
        return filename;
    }

    public void setFilename(List<String> filename) {
        this.filename = filename;
    }

    public List<ObjectId> getGridFsId() {
        return gridFsId;
    }

    public void setGridFsId(List<ObjectId> gridFsId) {
        this.gridFsId = gridFsId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
