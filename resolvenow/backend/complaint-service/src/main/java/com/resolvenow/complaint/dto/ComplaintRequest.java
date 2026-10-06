package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.ComplaintCategory;
import com.resolvenow.complaint.entity.ComplaintPriority;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class ComplaintRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private ComplaintCategory category;

    @NotNull(message = "Priority is required")
    private ComplaintPriority priority;
}
