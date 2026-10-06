package com.resolvenow.complaint.client;

import com.resolvenow.complaint.dto.AssignmentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ASSIGNMENT-SERVICE", path = "/api/assignments")
public interface AssignmentClient {

    @PostMapping
    void assignComplaint(@RequestBody AssignmentRequest request, @RequestHeader("Authorization") String token);
}
