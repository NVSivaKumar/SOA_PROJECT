package com.resolvenow.notification.controller;

import com.resolvenow.notification.dto.NotificationRequest;
import com.resolvenow.notification.entity.Notification;
import com.resolvenow.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Void> createNotification(
            @RequestBody NotificationRequest request) {

        notificationService.createNotification(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @RequestHeader("userId") Long userId,
            @RequestHeader("userRole") String role) {

        Long fetchUserId = role.equals("ADMIN") ? 0L : userId;

        return ResponseEntity.ok(
                notificationService.getUserNotifications(fetchUserId)
        );
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @RequestHeader("userId") Long userId,
            @RequestHeader("userRole") String role) {

        Long fetchUserId = role.equals("ADMIN") ? 0L : userId;

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(fetchUserId)
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id) {

        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader("userId") Long userId,
            @RequestHeader("userRole") String role) {

        Long fetchUserId = role.equals("ADMIN") ? 0L : userId;

        notificationService.markAllAsRead(fetchUserId);
        return ResponseEntity.ok().build();
    }
}
