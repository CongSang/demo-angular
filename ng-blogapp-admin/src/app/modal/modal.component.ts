import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  @Input() title: string | undefined = '';
  @Input() body: string | undefined = '';
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
}
