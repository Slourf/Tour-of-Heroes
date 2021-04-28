import React from "react";
import { Hero } from "./../Heroes/helper";
import { RouteComponentProps } from "react-router-dom";
import { store } from "../Notification/Notification";

import { url } from "../helpers";
import "./HeroDetail.css";
import { requestDelete, requestGet } from "../misc/api";

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
    requestDelete(`/api/heroes/${this.props.match.params.id}`)
      .then(() => {
        store.addNotification({
          message: "The hero was deleted sucessfully!",
          type: "success",
          timer: 2000
        });
        this.props.history.push("/heroes");
      })
      .catch(() => {
        store.addNotification({
          message: "An error occured while deleting the hero.",
          type: "error",
          timer: 2000
        });
      });
  };

  fetchHeroById = (id: string) => {
    requestGet(`/api/heroes/${id}`).then((res) => {
      const hero: Hero = res.data;
      hero.image_path = `${url}/${hero.image}`;
      hero.logo_path = `${url}/${hero.logo}`;
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
          <h1 className="hero-title">{hero.name}</h1>
        </div>
        <div className="hero-body">
          <button className="delete" onClick={this.deleteHero}>
            Delete Hero
          </button>
          <h1 className="hero-body-title">Description</h1>
          <div>
            {desc.map((paragraph, index) => {
              return <p key={index}>{paragraph}</p>;
            })}
          </div>
          <h1 className="hero-body-title">Spells</h1>
        </div>
      </div>
    );
  }
}
