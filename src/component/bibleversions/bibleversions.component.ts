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
  version: string = 'en-kjv';  // Default or initial value
  book: string = '';      // Default or initial value
  chapter: string = '';      // Default or initial value
  verse: string = '';        // Default or initial value
  show: boolean = false;
  versions: string[] = ["en-kjv"];
  showBibleVerseBool: boolean = true;
  showBibleChapterBool: boolean = false;

  // Array of books of the Bible (with no spaces)
  books: string[] = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1Samuel', '2Samuel', '1Kings', '2Kings',
    '1Chronicles', '2Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job',
    'Psalms', 'Proverbs', 'Ecclesiastes', 'SongOfSolomon', 'Isaiah', 'Jeremiah',
    'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
    'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
    'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1Corinthians',
    '2Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
    '1Thessalonians', '2Thessalonians', '1Timothy', '2Timothy', 'Titus',
    'Philemon', 'Hebrews', 'James', '1Peter', '2Peter', '1John', '2John',
    '3John', 'Jude', 'Revelation'
  ];
  

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

  nextVerse(currentverse: string): void {
    let currentverseInt = parseInt(currentverse, 10); // Convert string to int
    let nextVerseInt = currentverseInt + 1; // Increment by 1
    let nextVerseStr = nextVerseInt.toString(); // Convert back to string
  
    this.bibleService.getBibleData(this.version.toLowerCase(), this.book.toLowerCase(), this.chapter.toLowerCase(), nextVerseStr.toLowerCase()).subscribe(
      data => {
        this.bibleData = data;
        console.log(this.bibleData);
      },
      error => {
        console.error('Error fetching Bible data', error);
      }
    );
  }

  previousVerse(currentverse: string): void {
    let currentverseInt = parseInt(currentverse, 10); // Convert string to int
    let prevVerseInt = currentverseInt - 1; // Decrement by 1
    let prevVerseStr = prevVerseInt.toString(); // Convert back to string
  
    this.bibleService.getBibleData(this.version.toLowerCase(), this.book.toLowerCase(), this.chapter.toLowerCase(), prevVerseStr.toLowerCase()).subscribe(
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
        const chapterData = response.results;
        this.bibleChapter = this.removeDuplicates(chapterData);
        console.log(this.bibleChapter);
      },
      error => {
        console.error('Error fetching Bible Chapter data', error);
      }
    );
  }
  
  removeDuplicates(data: any[]): any[] {
    if (Array.isArray(data)) {
      return data.filter((value, index, self) =>
        index === self.findIndex((t) =>
          t.book === value.book && t.chapter === value.chapter && t.verse === value.verse
        )
      );
    }
    return [];
  }

  clearText() {
    this.bibleData = {};
    this.bibleChapter = [];
  }
}
