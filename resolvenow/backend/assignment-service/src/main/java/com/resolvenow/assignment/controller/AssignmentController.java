package com.resolvenow.assignment.controller;

import com.resolvenow.assignment.dto.AssignmentRequest;
import com.resolvenow.assignment.entity.Assignment;
import com.resolvenow.assignment.service.AssignmentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService = new AssignmentService();

    @PostMapping
    public ResponseEntity<Assignment> assignComplaint(
            @RequestBody AssignmentRequest request,
            HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader("Authorization");
        return ResponseEntity.ok(assignmentService.assignComplaint(request, token));
    }

    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<Assignment> getAssignmentByComplaintId(@PathVariable Long complaintId) {
        return assignmentService.getAssignmentByComplaintId(complaintId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/agent")
    public ResponseEntity<List<Assignment>> getAssignmentsByAgent(@RequestHeader("userId") Long agentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByAgentId(agentId));
    }
}
