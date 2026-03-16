package com.swaraj.fileshare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DebugController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/debug-db")
    public Map<String, Object> checkDatabase() {
        Map<String, Object> info = new HashMap<>();

        // 1. What database name is Spring actually using?
        info.put("connected_database_name", mongoTemplate.getDb().getName());

        // 2. What collections exist in this database?
        info.put("collections_found", mongoTemplate.getCollectionNames());

        // 3. How many documents are in the 'files' collection?
        // Note: We use "files" because that is what is in your @Document annotation
        if (mongoTemplate.collectionExists("files")) {
            info.put("document_count_in_files", mongoTemplate.getCollection("files").countDocuments());
        } else {
            info.put("document_count_in_files", "Collection 'files' NOT FOUND");
        }

        return info;
    }
}