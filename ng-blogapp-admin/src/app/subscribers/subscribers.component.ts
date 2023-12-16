import { Component, TemplateRef } from '@angular/core';
import { SubscriberService } from '../services/subscriber.service';
import { ModalService } from '../services/modal.service';
import { ISubscriberResponse } from '../models/subscriber';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [ModalComponent, CommonModule, RouterLink],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent {
  subscriberList: ISubscriberResponse[] = [];

  constructor(
    private subscriberService: SubscriberService, 
    private modalService: ModalService) { }

  ngOnInit(): void { 
    this.subscriberService.getSubscribers().subscribe((value) => {
      this.subscriberList = value
    });
  }

  onDelete(item: ISubscriberResponse, ref: TemplateRef<any>) {
    this.modalService.open(
      ref, 
      'Confirm', 
      `Are you sure to delete subscriber <span class='text-theme'>${item.data.name}</span>?`
    ).subscribe((action) => {
      if (action === 'confirm') {
        this.subscriberService.deleteSubscriber(item.id);
      }
    });
  }
}
