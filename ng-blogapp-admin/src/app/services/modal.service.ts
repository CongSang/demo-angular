import { ComponentFactoryResolver, Inject, Injectable, Injector, TemplateRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalNotifier?: Subject<any>; 

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector, @Inject(DOCUMENT) private document: Document) {}

  open(entry: TemplateRef<any>, title?: string, body?: string) {
    let factory = this.resolver.resolveComponentFactory(ModalComponent);

    const componentRef = entry.createEmbeddedView(null);
    const modal = factory.create(this.injector, [componentRef.rootNodes])

    modal.instance.title = title;
    modal.instance.body = body;
    
    modal.instance.closeEvent.subscribe(() => this.close());
    modal.instance.confirmEvent.subscribe(() => this.confirm());

    modal.hostView.detectChanges();

    this.document.body.appendChild(modal.location.nativeElement);
    this.modalNotifier = new Subject();

    return this.modalNotifier.asObservable();
  }

  close() {
    this.modalNotifier?.next('close');
    this.modalNotifier?.complete();
  }

  confirm() {
    this.modalNotifier?.next('confirm');
    this.modalNotifier?.complete();
  }
}
