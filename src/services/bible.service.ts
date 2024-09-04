// bible.service.ts
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  private baseUrl: string = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles';

  constructor(private http: HttpClient) { }

  getBibleData(version: string, book: string, chapter: string, verse: string): Observable<any> {
    const url = `${this.baseUrl}/${version}/books/${book}/chapters/${chapter}/verses/${verse}.json`;
    return this.http.get<any>(url);
  }
  getBibleChapter(version: string, book: string, chapter: string):Observable<any>{
    const url=`${this.baseUrl}/${version}/books/${book}/chapters/${chapter}.json`;
    return this.http.get<any>(url);
  }
}
