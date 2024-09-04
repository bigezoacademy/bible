import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BibleversionsModule } from '../component/bibleversions/bibleversions.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BibleversionsModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bible';
  
  constructor(){

  }
}
