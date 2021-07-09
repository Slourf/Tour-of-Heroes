import React from "react";
import { HeroWithStats } from "../Heroes/helper";
import { RouteComponentProps } from "react-router-dom";
import { store } from "../../Notification/Notification";

import { url, User } from "../../helpers";
import "./HeroDetail.css";
import { requestDelete, requestGet } from "../../misc/api";
import { withAuthenticatedUser } from "../../misc/auth";
import { Characteristic, characteristics } from "./helper";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  context: {
    authenticatedUser: User | null;
    clearAuthenticatedUser: () => void;
  } | null;
}

interface State {
  hero?: HeroWithStats;
  characteristics: Characteristic[];
}

class HeroDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      characteristics: [],
    };
  }

  componentDidMount = () => {
    this.fetchHeroById(this.props.match.params.id);
  };

  deleteHero = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    requestDelete(`/api/heroes/${this.props.match.params.id}`)
      .then(() => {
        store.addNotification({
          message: "The hero was deleted sucessfully!",
          type: "success",
          timer: 2000,
        });
        this.props.history.push("/heroes");
      })
      .catch(() => {
        store.addNotification({
          message: "An error occured while deleting the hero.",
          type: "error",
          timer: 2000,
        });
      });
  };

  fetchHeroById = (id: string) => {
    requestGet(`/api/heroes/stats/${id}`).then((res) => {
      const hero: HeroWithStats = res.data;
      hero.image_path = `${url}/${hero.image}`;
      hero.logo_path = `${url}/${hero.logo}`;
      const chara: Characteristic[] = characteristics(hero.stats);
      this.setState({ hero, characteristics: chara });
    });
  };

  render() {
    const { hero, characteristics } = this.state;
    const { context } = this.props;
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
          {context?.authenticatedUser?.admin && (
            <button className="delete" onClick={this.deleteHero}>
              Delete Hero
            </button>
          )}
          <h1 className="hero-body-title">Description</h1>
          <div>
            {desc.map((paragraph, index) => {
              return <p key={index}>{paragraph}</p>;
            })}
          </div>
          <h1 className="hero-body-title">Characteristic</h1>

          <div className="hero-chara">
            {characteristics.map((char: Characteristic) => {
              return (
                <div className="hero-chara-item">
                  <img src={char.icon} alt="" className="hero-chara-icon" />
                  <div>
                    <div className="hero-chara-name">{char.name}</div>
                    <div>
                      {char.value}{" "}
                      {char.value_upgrade !== null && (
                        <span className="hero-chara-upgrade-value">
                          (+{char.value_upgrade}
                          {char.percentage ? "%" : null})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <h1 className="hero-body-title">Spells</h1>
        </div>
      </div>
    );
  }
}
export default withAuthenticatedUser(HeroDetail);
