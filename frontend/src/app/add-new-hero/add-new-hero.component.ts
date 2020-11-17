import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-add-new-hero',
  templateUrl: './add-new-hero.component.html',
  styleUrls: ['./add-new-hero.component.css']
})
export class AddNewHeroComponent implements OnInit {

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
  }

  createHero(name: string): void {
    console.log(name);
    // this.heroService.addHero(name);
  }

}
