import React, { Fragment } from "react";
import { Hero } from "./helper";
import { Link } from "react-router-dom";
import axios from "axios";

import { heroesUrl } from "../helpers";
import "./Heroes.css";

interface Props {}

interface State {
  heroes: Hero[];
}

export default class Heroes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      heroes: [],
    };
  }

  componentDidMount = () => {
    this.fetchHeroes();
  };

  fetchHeroes = () => {
    axios.get(heroesUrl).then((res) => {
      const heroes = res.data;
      heroes.forEach((hero: Hero): void => {
        hero.image_path = `http://localhost:3000/${hero.image}`;
        hero.logo_path = `http://localhost:3000/${hero.logo}`;
      });
      this.setState({ heroes });
    });
  };

  render() {
    const { heroes } = this.state;
    if (!heroes) {
      return;
    }
    console.log(heroes);
    return (
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
                        <span className="badge label">{hero.id}</span>
                        <div className="label">{hero.name}</div>
                        </div>
                    </div>
                    </Link>
                </div>
              </Fragment>
          );
        })}
      </div>
    );
  }
}
