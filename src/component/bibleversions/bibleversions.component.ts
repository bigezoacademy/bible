import { Component, OnInit } from '@angular/core';
import { BibleService } from '../../services/bible.service';
import Swal from 'sweetalert2';

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

  // Handles moving to the next verse, next chapter, or next book if needed
  nextVerse(currentverse: string): void {
    let currentVerseInt = parseInt(currentverse, 10);
    let nextVerseInt = currentVerseInt + 1;

    // Try to fetch the next verse in the current chapter
    this.bibleService.getBibleData(this.version.toLowerCase(), this.book.toLowerCase(), this.chapter.toLowerCase(), nextVerseInt.toString().toLowerCase()).subscribe(
      data => {
        if (data && data.text) {
          this.verse = nextVerseInt.toString();
          this.bibleData = data;
          console.log(this.bibleData);
        } else {
          // If no next verse, move to the next chapter
          this.moveToNextChapter();
        }
      },
      error => {
        this.moveToNextChapter(); // If an error occurs, move to the next chapter
      }
    );
  }

  // Handles moving to the previous verse, previous chapter, or previous book if needed
  previousVerse(currentverse: string): void {
    let currentVerseInt = parseInt(currentverse, 10);
    let prevVerseInt = currentVerseInt - 1;

    if (prevVerseInt > 0) {
      // Try to fetch the previous verse in the current chapter
      this.bibleService.getBibleData(this.version.toLowerCase(), this.book.toLowerCase(), this.chapter.toLowerCase(), prevVerseInt.toString().toLowerCase()).subscribe(
        data => {
          if (data && data.text) {
            this.verse = prevVerseInt.toString();
            this.bibleData = data;
            console.log(this.bibleData);
          }
        },
        error => {
          console.error('Error fetching previous verse');
        }
      );
    } else {
      // If previous verse doesn't exist, move to the previous chapter
      this.moveToPreviousChapter();
    }
  }

  moveToNextChapter(): void {
    let currentChapterInt = parseInt(this.chapter, 10);
    let nextChapterInt = currentChapterInt + 1;
  
    this.bibleService.getBibleData(this.version.toLowerCase(), this.book.toLowerCase(), nextChapterInt.toString().toLowerCase(), '1').subscribe(
      data => {
        if (data && data.text) {
          this.chapter = nextChapterInt.toString();
          this.verse = '1';
          this.bibleData = data;
          console.log(this.bibleData);
  
          // Show alert for new chapter
          Swal.fire({
            title: 'Chapter Changed',
            text: `You are now in Chapter ${this.chapter}.`,
            icon: 'info',
            confirmButtonText: 'OK'
          });
        } else {
          this.moveToNextBook();
        }
      },
      error => {
        this.moveToNextBook();
      }
    );
  }
  

  moveToPreviousChapter(): void {
    let currentChapterInt = parseInt(this.chapter, 10);
    let prevChapterInt = currentChapterInt - 1;
  
    if (prevChapterInt > 0) {
      this.bibleService.getBibleChapter(this.version.toLowerCase(), this.book.toLowerCase(), prevChapterInt.toString().toLowerCase()).subscribe(
        chapterData => {
          let lastVerse = chapterData.results.length.toString();
          this.chapter = prevChapterInt.toString();
          this.verse = lastVerse;
          this.showVerse();
  
          // Show alert for new chapter
          Swal.fire({
            title: 'Chapter Changed',
            text: `You are now in Chapter ${this.chapter}.`,
            icon: 'info',
            confirmButtonText: 'OK'
          });
        },
        error => {
          this.moveToPreviousBook();
        }
      );
    } else {
      this.moveToPreviousBook();
    }
  }
  

  moveToNextBook(): void {
    let currentBookIndex = this.books.indexOf(this.book);
    if (currentBookIndex < this.books.length - 1) {
      let nextBook = this.books[currentBookIndex + 1];
      this.book = nextBook;
      this.chapter = '1';
      this.verse = '1';
      this.showVerse(); // Fetch the first verse of the new book
  
      // Show alert for new book
      Swal.fire({
        title: 'Book Changed',
        text: `You are now reading the Book of ${this.book}.`,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    } else {
      console.log('Reached the end of the Bible');
    }
  }

  
  moveToPreviousBook(): void {
    let currentBookIndex = this.books.indexOf(this.book);
    if (currentBookIndex > 0) {
      let prevBook = this.books[currentBookIndex - 1];
      this.book = prevBook;
  
      // Fetch the first chapter of the previous book
      this.bibleService.getBibleChapter(this.version.toLowerCase(), prevBook.toLowerCase(), '1').subscribe(
        chapterData => {
          let lastChapterInt = chapterData.results.length;
          let lastChapter = lastChapterInt.toString();
  
          // Fetch the last verse of the last chapter
          this.bibleService.getBibleChapter(this.version.toLowerCase(), prevBook.toLowerCase(), lastChapter).subscribe(
            lastChapterData => {
              let lastVerse = lastChapterData.results.length.toString();
              this.chapter = lastChapter;
              this.verse = lastVerse;
              this.showVerse();
  
              // Show alert for new book
              Swal.fire({
                title: 'Book Changed',
                text: `You are now reading the Book of ${this.book}.`,
                icon: 'info',
                confirmButtonText: 'OK'
              });
            },
            error => {
              console.error('Error fetching the last verse of the last chapter', error);
            }
          );
        },
        error => {
          console.error('Error fetching previous book\'s first chapter', error);
        }
      );
    } else {
      // Alert user if they are at the beginning of the Bible
      Swal.fire({
        title: 'No Previous Book',
        text: 'You have reached the beginning of the Bible.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
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
