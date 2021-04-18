import React from "react";
import { Hero } from "./../Heroes/helper";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { store } from "../Notification/Notification";
import { environment } from "../environment";

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

  deleteHero = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    axios
    .delete(`${heroesUrl}/${this.props.match.params.id}`)
    .then(() => {
      store.addNotification({ message: "The hero was deleted sucessfully!", type: "success"});
      this.props.history.push("/heroes");
    })
    .catch(() => {
      store.addNotification({ message: "An error occured while deleting the hero.", type: "error"});
    });
  }

  fetchHeroById = (id: string) => {
    axios.get(`${heroesUrl}/${id}`).then((res) => {
      const hero: Hero = res.data;
      hero.image_path = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/${hero.image}`;
      hero.logo_path = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/${hero.logo}`;
      this.setState({ hero });
    });
  };

  render() {
    const { hero } = this.state;
    if (!hero) {
      return null;
    }

    const desc = hero.description.split(/\r?\n/);
    return (
      <div>
        <div className="hero-header">
          <img src={hero.image_path} className="hero-image" alt="" />
          <h1 className="hero-title" >{hero.name}</h1>
        </div>
        <div className="hero-body">
          <button className="delete" onClick={this.deleteHero}>Delete Hero</button>
          <h1 className="hero-body-title">Description</h1>
          <div>
            {desc.map((paragraph, index) => {
              return (
                <p key={index}>
                  {paragraph}
                </p>
              )
            })}
          </div>
          <h1 className="hero-body-title">Spells</h1>
        </div>
      </div>
    );
  }
}
