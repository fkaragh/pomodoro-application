import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-message, message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="popup" *ngIf="isOpen">
      <div class="popup-content">
        <div class="popup-header" *ngIf="isCancellable">
          <button class="cancel-button" (click)="onCancel()">✕</button>
        </div>
        <p>{{ message }}</p>
        <button class="confirm-button" (click)="onConfirm()">
          {{ buttonText }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./popup-message.component.scss']
})
export class PopupMessageComponent {
  @Input() isOpen: boolean = false;
  @Input() message: string = '';
  @Input() buttonText: string = '✓';
  @Input() isCancellable: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  onConfirm(): void {
    this.confirm.emit();
    window.history.back(); // Navigate back
  }

  onCancel(): void {
    this.cancel.emit();
    window.history.back(); // Navigate back
  }
}