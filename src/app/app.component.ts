import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BibleversionsModule } from '../component/bibleversions/bibleversions.module';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../component/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BibleversionsModule, FormsModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bible';
  
  constructor(){

  }
}
