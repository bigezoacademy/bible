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
    if (!this.version || !this.book || !this.chapter || !this.verse) {
      let missingFields = [];
  
   /*    if (!this.version) {
        missingFields.push('Version');
      } */
      if (!this.book) {
        missingFields.push('Book');
      }
      if (!this.chapter) {
        missingFields.push('Chapter');
      }
      if (!this.verse) {
        missingFields.push('Verse');
      }
  
      // Show the alert with the missing fields
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: `${missingFields.join(', ')}`,
      });
  
      return; // Exit early if any required field is missing
    }
  
    // Ensure that we are not calling toLowerCase() on null or undefined
    const version = this.version ? this.version.toLowerCase() : '';
    const book = this.book ? this.book.toLowerCase() : '';
    const chapter = this.chapter ? this.chapter.toLowerCase() : '';
    const verse = this.verse ? this.verse.toLowerCase() : '';
  
    this.bibleService.getBibleData(version, book, chapter, verse).subscribe(
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
      // Fetch the previous chapter data to get the number of verses
      this.bibleService.getBibleData(this.version.toLowerCase(), this.book.toLowerCase(), prevChapterInt.toString().toLowerCase(), '1').subscribe(
        chapterData => {
          // Check if chapterData contains the verses
          if (chapterData && Array.isArray(chapterData.results)) {
            let numberOfVerses = chapterData.results.length; // Number of verses in the previous chapter
            
            if (numberOfVerses > 0) {
              this.chapter = prevChapterInt.toString();
              this.verse = numberOfVerses.toString(); // Set the verse to the last one of the previous chapter
              this.showVerse(); // Fetch and display the verse
  
              // Show alert for new chapter
              Swal.fire({
                title: 'Chapter Changed',
                text: `You are now in Chapter ${this.chapter}.`,
                icon: 'info',
                confirmButtonText: 'OK'
              });
            } else {
              console.error('No verses found in the previous chapter');
            }
          } else {
            console.error('Invalid data format for previous chapter');
          }
        },
        error => {
          console.error('Error fetching previous chapter data', error);
          this.moveToPreviousBook(); // Move to the previous book if there is an error
        }
      );
    } else {
      this.moveToPreviousBook(); // Move to the previous book if there is no previous chapter
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
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-confirm-button' // Apply the custom class
        }
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
  
      // Fetch the first chapter of the previous book to determine the number of chapters
      this.bibleService.getBibleData(this.version.toLowerCase(), prevBook.toLowerCase(), '1', '1').subscribe(
        chapterData => {
          console.log('Previous Book\'s First Chapter Data:', chapterData); // Log the full response
  
          // Ensure chapterData and results are defined and are arrays
          if (chapterData && Array.isArray(chapterData.results)) {
            let numberOfChapters = chapterData.results.length;
  
            if (numberOfChapters > 0) {
              // Assuming `numberOfChapters` is the count of chapters
              let lastChapter = numberOfChapters.toString();
  
              this.bibleService.getBibleData(this.version.toLowerCase(), prevBook.toLowerCase(), lastChapter,'1').subscribe(
                lastChapterData => {
                  console.log('Last Chapter Data:', lastChapterData); // Log the full response
  
                  // Ensure lastChapterData and results are defined and are arrays
                  if (lastChapterData && Array.isArray(lastChapterData.results)) {
                    let numberOfVerses = lastChapterData.results.length;
  
                    if (numberOfVerses > 0) {
                      let lastVerse = numberOfVerses.toString();
                      this.chapter = lastChapter;
                      this.verse = lastVerse;
                      this.showVerse(); // Fetch and display the verse
  
                      // Show alert for new book
                      Swal.fire({
                        title: 'Book Changed',
                        text: `You are now reading the Book of ${this.book}.`,
                        icon: 'info',
                        confirmButtonText: 'OK'
                      });
                    } else {
                      console.error('No verses found in the last chapter of the previous book');
                    }
                  } else {
                    console.error('Invalid data format for last chapter');
                  }
                },
                error => {
                  console.error('Error fetching last chapter data', error);
                }
              );
            } else {
              this.showVerse();
              console.error('No chapters found in the previous book');
            }
          } else {
            console.error('Invalid data format for previous book\'s first chapter');
          }
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
    this.bibleService.getChapter(this.version.toLowerCase(), this.book.toLowerCase(), this.chapter.toLowerCase()).subscribe(
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
