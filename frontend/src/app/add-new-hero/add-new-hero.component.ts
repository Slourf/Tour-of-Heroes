import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-add-new-hero',
  templateUrl: './add-new-hero.component.html',
  styleUrls: ['./add-new-hero.component.css']
})
export class AddNewHeroComponent implements OnInit {

  constructor(private heroService: HeroService) { }

  private id;
  public hero: Hero = {
    id: null,
    name: '',
    description: '',
    logo: null,
    image: null
  };

  ngOnInit(): void {
  }

  handleInputField(value: string) {
    this.hero[self.name] = value;
  }

  handleFileField(value: File) {
    this.hero[self.name] = value;
  }

  onSubmit(form: NgForm) {
    this.heroService.addHero(this.hero)
      .subscribe(status => { this.id = "OK" });
  }

  createHero(name: string): void {
    console.log(name);
    // this.heroService.addHero(name);
  }
}
