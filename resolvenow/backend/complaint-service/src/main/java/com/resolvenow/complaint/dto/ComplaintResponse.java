package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.ComplaintCategory;
import com.resolvenow.complaint.entity.ComplaintPriority;
import com.resolvenow.complaint.entity.ComplaintStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponse {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private ComplaintCategory category;
    private ComplaintPriority priority;
    private ComplaintStatus status;
    private Long customerId;
    private String customerName;
    private String assignedDepartment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
