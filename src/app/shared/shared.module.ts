import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

@NgModule({
  declarations: [
    // Pipes would go here if not standalone
  ],
  imports: [
    CommonModule,
    ToastComponent, // Import standalone component
    CurrencyFormatPipe // Import standalone pipe
  ],
  exports: [
    CommonModule,
    ToastComponent,
    CurrencyFormatPipe
  ]
})
export class SharedModule { }
