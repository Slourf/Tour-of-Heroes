import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  selectedHero: Hero;

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => { 
        this.heroes = heroes;
        this.heroes.forEach((hero: Hero) => {
          hero.image_path = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/${hero.image}`;
          hero.logo_path = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/${hero.logo}`;
        });
      });
  }

  ngOnInit(): void {
    this.getHeroes();
  }
}
