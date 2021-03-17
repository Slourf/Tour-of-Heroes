import React from "react";
import { Hero } from "./../Heroes/helper";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";

import { heroesUrl } from "../helpers";
import "./HeroDetail.css"

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

interface State {
  hero?: Hero;
}

export default class HeroDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {
    this.fetchHeroById(this.props.match.params.id);
  };

  fetchHeroById = (id: string) => {
    axios.get(`${heroesUrl}/${id}`).then((res) => {
      const hero: Hero = res.data;
      hero.image_path = `http://localhost:3000/${hero.image}`;
      hero.logo_path = `http://localhost:3000/${hero.logo}`;
      this.setState({ hero });
    });
  };

  render() {
    const { hero } = this.state;
    if (!hero) {
      return null;
    }
    console.log(hero);
    return (
      <div>
        <div className="hero-body">
          
          <img src={hero.image_path} className="hero-image" alt="" />
          <h1 className="hero-title" >{hero.name}</h1>
          <div>{hero.description}</div>

        </div>
      </div>
    );
  }
}
