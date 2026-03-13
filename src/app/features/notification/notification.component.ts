import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  ngOnInit(): void {
    this.getNotificationData();
  }

  getNotificationData(): void {
    this.notificationService.getNotification().subscribe((res) => {
      console.log(res.data.notifications);
    });
  }
}
