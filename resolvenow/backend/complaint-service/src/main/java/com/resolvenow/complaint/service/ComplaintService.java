package com.resolvenow.complaint.service;

import com.resolvenow.complaint.client.AssignmentClient;
import com.resolvenow.complaint.dto.AssignmentRequest;
import com.resolvenow.complaint.dto.ComplaintRequest;
import com.resolvenow.complaint.dto.ComplaintResponse;
import com.resolvenow.complaint.entity.Complaint;
import com.resolvenow.complaint.entity.ComplaintStatus;
import com.resolvenow.complaint.repository.ComplaintRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final AssignmentClient assignmentClient;

    public ComplaintResponse createComplaint(ComplaintRequest request, Long customerId, String customerName, String token) {
        String ticketNumber = "RN-" + java.time.Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Complaint complaint = Complaint.builder()
                .ticketNumber(ticketNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(ComplaintStatus.OPEN)
                .customerId(customerId)
                .customerName(customerName)
                .build();

        complaint = complaintRepository.save(complaint);

        try {
            AssignmentRequest assignmentRequest = AssignmentRequest.builder()
                    .complaintId(complaint.getId())
                    .category(complaint.getCategory().name())
                    .build();
            assignmentClient.assignComplaint(assignmentRequest, token);
            
            // Assuming successful assignment logic updates status later, or we can set it here if we assume immediate synchronous assignment.
            // For now, let the assignment service handle it, or we just keep it OPEN until AssignmentService responds.
        } catch (Exception e) {
            log.error("Failed to assign complaint to a department", e);
        }

        return mapToResponse(complaint);
    }

    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getComplaintsByCustomer(Long customerId) {
        return complaintRepository.findByCustomerId(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return mapToResponse(complaint);
    }

    public ComplaintResponse resolveComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolvedAt(java.time.LocalDateTime.now());
        complaint = complaintRepository.save(complaint);
        
        return mapToResponse(complaint);
    }

    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new RuntimeException("Complaint not found");
        }
        complaintRepository.deleteById(id);
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .ticketNumber(complaint.getTicketNumber())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .priority(complaint.getPriority())
                .status(complaint.getStatus())
                .customerId(complaint.getCustomerId())
                .customerName(complaint.getCustomerName())
                .assignedDepartment(complaint.getAssignedDepartment())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .build();
    }
}
