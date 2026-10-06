package com.resolvenow.complaint.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AssignmentRequest {
    private Long complaintId;
    private String category;
}
