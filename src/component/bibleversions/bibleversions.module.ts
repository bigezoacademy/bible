import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleversionsComponent } from './bibleversions.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BibleversionsComponent],
  imports: [CommonModule,FormsModule],
  exports: [BibleversionsComponent]  // Export if needed in other modules
})
export class BibleversionsModule {}
