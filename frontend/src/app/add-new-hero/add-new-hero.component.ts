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

  public hero: Hero =  {
      id: null,
      name: '',
      description: '',
      logo: null,
      image: null
    };

  ngOnInit(): void {
  }

  handleInputField(data: { id: string, value: string, name: string }) {
    if (data.id && data.value) {
      this.hero[data.id] = data.value;
      console.log(this.hero);
    }
  }

  handleFileField(data: { id: string, value: File, name: string }) {
    if (data.id && data.value) {
      this.hero[data.id] = data.value;
      console.log(this.hero);
    }
  }

  onSubmit(form: NgForm) {
    console.log(this.hero);
    this.heroService.addHero(this.hero)
      .subscribe(status => { console.log(status) });
  }
}
