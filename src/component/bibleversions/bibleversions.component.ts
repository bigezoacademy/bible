import { Component, OnInit } from '@angular/core';
import { BibleService } from '../../services/bible.service';

@Component({
  selector: 'app-bibleversions',
  templateUrl: './bibleversions.component.html',
  styleUrls: ['./bibleversions.component.css']
})
export class BibleversionsComponent implements OnInit {
  bibleData: any = {};
  bibleChapter: any[] = [];
  version: string = '';  // Default or initial value
  book: string = '';      // Default or initial value
  chapter: string = '';      // Default or initial value
  verse: string = '';        // Default or initial value
  show: boolean = false;
  versions: string[] = ["en-kjv"];
  showBibleVerseBool: boolean = true;
  showBibleChapterBool: boolean = false;

  constructor(private bibleService: BibleService) { }

  ngOnInit(): void {
    this.showVerse();  // Fetch initial data on component load
    this.showChapter();
  }

  toChapter(): void {
    this.showBibleChapterBool = true;
    this.showBibleVerseBool = false;
  }

  toVerse(): void {
    this.showBibleChapterBool = false;
    this.showBibleVerseBool = true;
  }

  showVerse(): void {
    this.show = true;
    this.bibleService.getBibleData(this.version.toLowerCase(), this.book.toLowerCase(), this.chapter.toLowerCase(), this.verse.toLowerCase()).subscribe(
      data => {
        this.bibleData = data;
        console.log(this.bibleData);
      },
      error => {
        console.error('Error fetching Bible data', error);
      }
    );
  }

  showChapter(): void {
    this.show = true;
    this.bibleService.getBibleChapter(this.version.toLowerCase(), this.book.toLowerCase(), this.chapter.toLowerCase()).subscribe(
      response => {
        console.log('API Response:', response);
        const chapterData = response.results; // Adjust according to the actual structure
        this.bibleChapter = this.removeDuplicates(chapterData);
        console.log(this.bibleChapter);
      },
      error => {
        console.error('Error fetching Bible Chapter data', error);
      }
    );
  }
  
  removeDuplicates(data: any[]): any[] {
    // Check if data is an array before attempting to remove duplicates
    if (Array.isArray(data)) {
      return data.filter((value, index, self) =>
        index === self.findIndex((t) =>
          t.book === value.book && t.chapter === value.chapter && t.verse === value.verse
        )
      );
    }
    return []; // Return empty array if data is not an array
  }

  clearText() {
    this.bibleData = {}; // Clear bibleData
    this.bibleChapter = [];
  }
}
