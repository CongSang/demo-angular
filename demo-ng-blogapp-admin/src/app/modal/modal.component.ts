import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() title: string = '';
  @Input() body: string = '';
  @Output() closeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    // this.isShown = true;
  }

  onClose() {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }
  
  onConfirm() {
    this.elementRef.nativeElement.remove();
    this.confirmEvent.emit();
  }

  ngOnDestroy(): void {
    // this.isShown = false;
  }
}
