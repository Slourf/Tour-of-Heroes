import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { from, Observable, of} from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  
  private heroesUrl = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/api/heroes`;

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes(): Observable<Hero[]> {
    this.log(`fetch heroes`);
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHero(id: number): Observable<Hero> {

    this.log(`fetch hero id=${id}`);
    return this.http.get<Hero>(this.heroesUrl + `/${id}`);
  }

  addHero(name: string): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, { name });
  }
}
