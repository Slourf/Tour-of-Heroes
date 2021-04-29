import React, { Fragment } from "react";
import { Hero } from "./helper";
import { Link } from "react-router-dom";

import { url } from "../helpers";
import "./Heroes.css";
import InputField from "../FormTools/InputField/InputField";
import { requestGet } from "../misc/api";

interface Props {}

interface State {
  heroes: Hero[];
  search: string;
}

export default class Heroes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      heroes: [],
      search: "",
    };
  }

  componentDidMount = () => {
    this.fetchHeroes();
  };

  fetchHeroes = () => {
    requestGet("/api/heroes").then((res) => {
      const heroes: Hero[] = res.data.sort((h1: Hero, h2: Hero) =>
        h1.name.localeCompare(h2.name)
      );
      console.log(heroes);
      heroes.forEach((hero: Hero): void => {
        hero.image_path = `${url}/${hero.image}`;
        hero.logo_path = `${url}/${hero.logo}`;
      });
      this.setState({ heroes });
    });
  };

  handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ ...this.state, search: event.currentTarget.value });
  };

  render() {
    let { heroes, search } = this.state;
    if (!heroes) {
      return;
    }
    heroes = heroes.filter((hero: Hero) =>
      hero.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div>
        {/*<InputField id="search" name="Search" onChange={this.handleSearch} />*/}
        <div className="heroes">
          {heroes.map((hero, index) => {
            return (
              <Fragment>
                <div key={`hero-${index}`} className="hero">
                  <Link to={"/heroes/" + hero.id}>
                    <div className="image-container">
                      <img className="logo" src={hero.logo_path} alt="" />
                    </div>
                    <div>
                      <div className="label-container">
                        <div className="label" style={{ margin: "auto" }}>
                          {hero.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}
