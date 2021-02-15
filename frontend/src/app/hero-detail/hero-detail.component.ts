import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from '../hero.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => {
        this.hero = hero;
        this.hero.image_path = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/${this.hero.image}`;
        this.hero.logo_path = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/${this.hero.logo}`;
        console.log(this.hero);
      });
  }

  goBack(): void {
    this.location.back();
  }

}
