package com.resolvenow.assignment.service;

import com.resolvenow.assignment.client.NotificationClient;
import com.resolvenow.assignment.dto.AssignmentRequest;
import com.resolvenow.assignment.dto.NotificationRequest;
import com.resolvenow.assignment.entity.Assignment;
import com.resolvenow.assignment.entity.AssignmentStatus;
import com.resolvenow.assignment.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository = null;
    private final NotificationClient notificationClient = null;

    public Assignment assignComplaint(AssignmentRequest request, String token) {
        String department = mapCategoryToDepartment(request.getCategory());

        Assignment assignment = Assignment.builder()
                .complaintId(request.getComplaintId())
                .department(department)
                .status(AssignmentStatus.PENDING)
                .build();

        assignment = assignmentRepository.save(assignment);

        try {
            NotificationRequest notification = NotificationRequest.builder()
                    // If we had the customer ID in the request, we could send it directly to them.
                    // Assuming user ID 0 means "system" or all admins, or we can just send it to a general topic.
                    .userId(0L) 
                    .complaintId(assignment.getComplaintId())
                    .title("Complaint Assigned")
                    .message("Complaint has been assigned to " + department)
                    .type("COMPLAINT_ASSIGNED")
                    .build();

            notificationClient.sendNotification(notification, token);
        } catch (Exception e) {
            log.error("Failed to send notification for assignment", e);
        }

        return assignment;
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentByComplaintId(Long complaintId) {
        return assignmentRepository.findByComplaintId(complaintId);
    }
    
    public List<Assignment> getAssignmentsByAgentId(Long agentId) {
        return assignmentRepository.findByAssignedAgentId(agentId);
    }

    private String mapCategoryToDepartment(String category) {
        return switch (category.toUpperCase()) {
            case "TECHNICAL" -> "TECHNICAL_SUPPORT";
            case "BILLING" -> "BILLING";
            case "ACCOUNT" -> "ACCOUNT_SUPPORT";
            case "NETWORK" -> "NETWORK_OPERATIONS";
            case "SECURITY" -> "SECURITY";
            default -> "GENERAL_SUPPORT";
        };
    }
}
