import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleversionsComponent } from './bibleversions.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [BibleversionsComponent],
  imports: [CommonModule,FormsModule,SweetAlert2Module],
  exports: [BibleversionsComponent]  // Export if needed in other modules
})
export class BibleversionsModule {}
