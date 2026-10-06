package com.resolvenow.complaint.controller;

import com.resolvenow.complaint.dto.ComplaintRequest;
import com.resolvenow.complaint.dto.ComplaintResponse;
import com.resolvenow.complaint.service.ComplaintService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody ComplaintRequest request,
            @RequestHeader("userId") Long userId,
            @RequestHeader("loggedInUser") String customerName,
            HttpServletRequest httpRequest) {
        
        String token = httpRequest.getHeader("Authorization");
        return new ResponseEntity<>(complaintService.createComplaint(request, userId, customerName, token), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(@RequestHeader("userRole") String role, @RequestHeader("userId") Long userId) {
        if ("CUSTOMER".equals(role)) {
            return ResponseEntity.ok(complaintService.getComplaintsByCustomer(userId));
        }
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<?> resolveComplaint(@PathVariable Long id, @RequestHeader("userRole") String role) {
        if (!"AGENT".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only agents or admins can resolve tickets");
        }
        return ResponseEntity.ok(complaintService.resolveComplaint(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id, @RequestHeader("userRole") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can delete tickets");
        }
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok().build();
    }
}
