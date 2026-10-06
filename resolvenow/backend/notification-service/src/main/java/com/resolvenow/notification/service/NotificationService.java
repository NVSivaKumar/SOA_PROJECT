package com.resolvenow.notification.service;

import com.resolvenow.notification.dto.NotificationRequest;
import com.resolvenow.notification.entity.Notification;
import com.resolvenow.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .complaintId(request.getComplaintId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .build();
        
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        // Return all notifications for the user
        // We could also return system wide notifications (userId = 0) if the user is an admin
        // For simplicity, just return user's notifications + system wide notifications
        List<Notification> userNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (userId != 0L) {
            List<Notification> systemNotifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(0L);
            userNotifications.addAll(systemNotifications);
            // Sorting could be done here if needed
        }
        return userNotifications;
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
