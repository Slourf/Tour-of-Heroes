import React from "react";
import { HeroWithStats } from "./../Heroes/helper";
import { RouteComponentProps } from "react-router-dom";
import { store } from "../Notification/Notification";

import { url, User } from "../helpers";
import "./HeroDetail.css";
import { requestDelete, requestGet } from "../misc/api";
import { withAuthenticatedUser } from "../misc/auth";
import health_icon from "./stats-icones/Health_icon.png";
import health_regen_icon from "./stats-icones/Health_regeneration_icon.png";
import ressource_icon from "./stats-icones/Mana_icon.png";
import ressource_regen_icon from "./stats-icones/Mana_regeneration_icon.png";
import ability_power_icon from "./stats-icones/Ability_power_icon.png";
import armor_icon from "./stats-icones/Armor_icon.png";
import margic_resist_icon from "./stats-icones/Magic_resistance_icon.png";
import attack_damage_icon from "./stats-icones/Attack_damage_icon.png";
import attack_speed_icon from "./stats-icones/Attack_speed_icon.png";
import movement_speed_icon from "./stats-icones/Movement_speed_icon.png";
import range_icon from "./stats-icones/Range_icon.png";
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
