import React, { Component } from "react";
import DiceRoller from "./dice_roller";
import ExperienceTrack from "./experienceTrack";
import ProgressTrack from "./progressTrack";
import RollButton from "./rollButton";
import RollIcon from "./rollIcon";
import StatTrack from "./statTrack";
import TitleBlock from "./titleBlock";
import UnselectedPlayer from "./unselected_player";
class Stats extends Component {
  state = { health: 5, spirit: 5, momentum: -2 };

  constructor() {
    super();
    this.diceRoller = new DiceRoller();
  }

  handleSelectedPlayerFieldChange = (field, value) => {
    const players = this.props.players.map((p) => {
      if (p.selected === true) {
        p[field] = value;
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleOnRollPlayerName = () => {
    let rn = this.props.oracles.IronlanderName;
    this.handleSelectedPlayerFieldChange("name", rn);
  };

  handleOnRollPlayerRole = () => {
    let rn = this.props.oracles.CharacterRole;
    this.handleSelectedPlayerFieldChange("role", rn);
  };

  handleOnRollPlayerGoal = () => {
    let rn = this.props.oracles.CharacterGoal;
    this.handleSelectedPlayerFieldChange("goal", rn);
  };

  handleOnRollPlayerDescriptor = () => {
    let rn = this.props.oracles.CharacterDescriptor;
    this.handleSelectedPlayerFieldChange("descriptor", rn);
  };

  valueToStat(val, steps) {
    let n = 100 / (steps - 1);
    return val === 0 ? 0 : Math.round(val / n);
  }

  handleStatTrackChange = (evt, name, steps, offset) => {
    let val = evt.target.value;
    let stat = this.valueToStat(val, steps) + offset;
    const players = this.props.players.map((p) => {
      if (p.selected) {
        const stats = p.stats.map((s) => {
          if (s.stat === name) {
            s.value = stat;
          }
          return s;
        });
      }
      return p;
    });

    this.setState({ players });
    if (name === "Impeto") this.checkMomentum();
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleDebilityChange = (evt, name) => {
    let checked = evt.target.checked;
    let count = 0;
    const players = this.props.players.map((p) => {
      if (p.selected) {
        const debilities = p.debilities.map((d) => {
          if (d.name === name) {
            d.active = checked;
            this.props.addLog("event", `${p.name} is ${checked ? "" : "no longer"} ${d.name}`);
          }
          return d;
        });
        count = debilities.filter((d) => d.active).length;
        p.maxMomentum = 10 - count;
        switch (count) {
          case 0:
            p.resetMomentum = 2;
            break;
          case 1:
            p.resetMomentum = 1;
            break;
          default:
            p.resetMomentum = 0;
            break;
        }
      }
      return p;
    });
    this.setState({ players });
    this.checkMomentum();
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  checkMomentum() {
    const players = this.props.players.map((p) => {
      if (p.selected) {
        const stats = p.stats.map((s) => {
          if (s.stat === "Impeto" && s.value > p.maxMomentum) {
            s.value = p.maxMomentum;
          }
          return s;
        });
      }
      return p;
    });

    this.setState({ players });
  }

  handleOnExperienceChange = (type) => {
    const players = this.props.players.map((p) => {
      if (p.selected) {
        // eslint-disable-next-line default-case
        switch (type) {
          case "INC":
            p.totalExperience = p.totalExperience + 1 >= 30 ? 30 : p.totalExperience + 1;
            this.props.addLog("event", `L'esperienza di ${p.name} è aumentata ora ha ${p.totalExperience} punti`);
            break;
          case "DEC":
            p.totalExperience = p.totalExperience - 1 <= 0 ? 0 : p.totalExperience - 1;

            p.spentExperience = p.totalExperience < p.spentExperience ? p.totalExperience : p.spentExperience;
            this.props.addLog("event", `L'esperienza di ${p.name} è diminuita ora ha ${p.totalExperience} punti`);
            break;
          case "REG":
            p.spentExperience = p.spentExperience - 1 <= 0 ? 0 : p.spentExperience - 1;
            break;
          case "ADV":
            p.spentExperience = p.spentExperience + 1 >= 30 ? 30 : p.spentExperience + 1;

            p.totalExperience = p.spentExperience > p.totalExperience ? p.spentExperience : p.totalExperience;
            break;
        }
      }
      return p;
    });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
    this.setState({ players });
  };

  handleOnPlayerProgressionChanged = (playerName, field, increment) => {
    let val = 0;
    val = increment ? 1 : -1;

    // switch (field) {
    //   case "bonds":
    //     break;
    //   case "failure":
    //     val = increment ? 1 : -1;
    //     break;
    // }
    const players = this.props.players.map((p) => {
      if (p.name === playerName) {
        p[field] += val;
        p[field] = p[field] > 40 ? 40 : p[field];
        p[field] = p[field] < 0 ? 0 : p[field];
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleOnPlayerStatChanged = (stat, increment) => {
    const players = this.props.players.map((p) => {
      if (p.selected === true) {
        let val = increment ? 1 : -1;
        p.stats.map((s) => {
          if (s.stat !== stat) return s;
          s.value = parseInt(s.value) + val;
          if (s.type === "core") {
            s.value = s.value > 4 ? 4 : s.value;
            s.value = s.value < 0 ? 0 : s.value;
          } else if (s.stat === "Impeto") {
            s.value = s.value > 10 ? 10 : s.value;
            s.value = s.value < -6 ? -6 : s.value;
          } else {
            s.value = s.value > 5 ? 5 : s.value;
            s.value = s.value < 0 ? 0 : s.value;
          }
          return s;
        });
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleMomentumReset = () => {
    const players = this.props.players.map((p) => {
      if (p.selected === true) {
        p.stats.map((s) => {
          if (s.stat !== "Impeto") return s;
          s.value = this.props.selectedPlayer.resetMomentum;
          return s;
        });
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleOnProgressRollClicked = () => {
    const players = this.props.players.map((p) => {
      if (p.selected) {
        p.failureRoll = this.diceRoller.progressionRoll(Math.floor(p.failure / 4));
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  componentDidUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  render() {
    if (this.props.selectedPlayer == null) return <UnselectedPlayer />;
    return (
      <React.Fragment>
        <h1 className="">{this.props.selectedPlayer.name}</h1>
        <TitleBlock title="BARRE" />
        <div className="row text-center">
          <div className="col mt-4">
            <div className="btn btn-outline-dark momentum-stat mr-1">
              <h5>{this.props.selectedPlayer.maxMomentum}</h5>
              <h6>MAX</h6>
            </div>
            <button className="btn btn-outline-dark momentum-stat" onClick={() => this.handleMomentumReset()}>
              <h5>{this.props.selectedPlayer.resetMomentum}</h5>
              <h6>RESET</h6>
            </button>
          </div>
        </div>
        <div className="stat-tracks">
          <div className="d-none d-md-block">
            <StatTrack
              min={-6}
              max={10}
              // onChange={this.handleMomentumTrackChange}
              onChange={this.handleStatTrackChange}
              value={this.props.selectedPlayer.stats.find((s) => s.stat === "Impeto").value}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat === "Impeto")}
            />
            <StatTrack
              min={0}
              max={5}
              onChange={this.handleStatTrackChange}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat === "Vita")}
              value={this.props.selectedPlayer.stats.find((s) => s.stat === "Vita").value}
            />
            <StatTrack
              min={0}
              max={5}
              value={this.props.selectedPlayer.stats.find((s) => s.stat === "Spirito").value}
              onChange={this.handleStatTrackChange}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat === "Spirito")}
            />
            <StatTrack
              min={0}
              max={5}
              value={this.props.selectedPlayer.stats.find((s) => s.stat === "Risorse").value}
              onChange={this.handleStatTrackChange}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat === "Risorse")}
            />
          </div>
          <div className="d-block d-md-none text-center">
            {this.props.selectedPlayer.stats
              .filter((s) => s.type === "status")
              .map((s) => (
                <div className="col-12 col-lg stat-col">
                  <div key={s.stat} className="card stat-card">
                    <div className="container">
                      <div className="row">
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, false)}
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div className="col-4">
                          <h2>{s.value}</h2>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, true)}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="modesto">{s.stat}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <TitleBlock title="CARATTERISTICHE" />
        <div className="container">
          <div className="row row-cols-5 text-center">
            {this.props.selectedPlayer.stats
              .filter((s) => s.type === "core")
              .map((s) => (
                <div className="col-12 col-lg stat-col">
                  <div key={s.stat} className="card stat-card">
                    <div className="container">
                      <div className="row">
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, false)}
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div className="col-4">
                          <h2>{s.value}</h2>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, true)}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="modesto">{s.stat}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <TitleBlock title="ESPERIENZA" />
        <ExperienceTrack
          selectedPlayer={this.props.selectedPlayer}
          key={this.props.selectedPlayer}
          progress={this.props.selectedPlayer.bonds}
          onExperienceChange={this.handleOnExperienceChange}
        />
        <div className="stat-tracks">
          <TitleBlock title="LEGAMI" />

          <ProgressTrack
            key={this.props.selectedPlayer}
            progress={this.props.selectedPlayer.bonds}
            onProgressionChange={(increment) =>
              this.handleOnPlayerProgressionChanged(this.props.selectedPlayer.name, "bonds", increment)
            }
            // hideButtons={true}
          />
          <TitleBlock title="FALLIMENTI" />

          <ProgressTrack
            key={this.props.selectedPlayer}
            progress={this.props.selectedPlayer.failure}
            onProgressionChange={(increment) =>
              this.handleOnPlayerProgressionChanged(this.props.selectedPlayer.name, "failure", increment)
            }
            // hideButtons={true}
          />
          <div className="row">
            <div className="col-4 d-sm-none d-lg-block"></div>
            <div className="col-lg-4 col-sm-12">
              <RollButton
                buttonText="Impara dai tuoi sbagli"
                roll={this.props.selectedPlayer.failureRoll}
                onRoll={() => this.handleOnProgressRollClicked()}
              />
            </div>
            <div className="col-4 d-sm-none d-lg-block"></div>
          </div>
        </div>

        <div className="debilities text-center">
          <TitleBlock title="DEBOLEZZE" />
          <div className="row modesto">
            <div className="col-12 col-lg-4 mt-4">
              <h4 className="mb-4">CONDITIONS</h4>
              {this.props.selectedPlayer.debilities
                .filter((d) => d.type === "conditions")
                .map((d) => (
                  <div key={d.name} className="deb-cb">
                    <input
                      type="checkbox"
                      //   name="cb"
                      id={`cb_${d.name}`}
                      checked={d.active}
                      onChange={(e) => this.handleDebilityChange(e, d.name)}
                    />
                    <label htmlFor={`cb_${d.name}`}>{d.name}</label>
                  </div>
                ))}
            </div>
            <div className="col-12 col-lg-4 mt-4">
              <h4 className="mb-4">BANES</h4>
              {this.props.selectedPlayer.debilities
                .filter((d) => d.type === "banes")
                .map((d) => (
                  <div className="deb-cb">
                    <input
                      type="checkbox"
                      //   name="cb"
                      id={`cb_${d.name}`}
                      checked={d.active}
                      onChange={(e) => this.handleDebilityChange(e, d.name)}
                    />
                    <label htmlFor={`cb_${d.name}`}>{d.name}</label>
                  </div>
                ))}
            </div>
            <div className="col-12 col-lg-4 mt-4">
              <h4 className="mb-4">BURDENS</h4>
              {this.props.selectedPlayer.debilities
                .filter((d) => d.type === "burdens")
                .map((d) => (
                  <div className="deb-cb">
                    <input
                      type="checkbox"
                      //   name="cb"
                      id={`cb_${d.name}`}
                      checked={d.active}
                      onChange={(e) => this.handleDebilityChange(e, d.name)}
                    />
                    <label htmlFor={`cb_${d.name}`}>{d.name}</label>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <TitleBlock title="LEGAMI" />
            <table className="table table-striped modesto">
              <thead>
                <th>Type</th>
                <th>Name</th>
              </thead>
              <tbody>
                {this.props.locations.map((l) => {
                  if (l.bond > 0) {
                    return (
                      <tr>
                        <td>Location</td>
                        <td>{l.name}</td>
                      </tr>
                    );
                  }
                })}
                {this.props.npcs.map((n) => {
                  if (n.bond > 0) {
                    return (
                      <tr>
                        <td>NPC</td>
                        <td>{n.name}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <TitleBlock title="DETTAGLI" />
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-dark"
                      type="button"
                      title="Chiedi all'Oracolo"
                      onClick={() => this.handleOnRollPlayerName()}
                    >
                      <RollIcon /> Name
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nome del personaggio"
                    aria-label="Nome"
                    aria-describedby="basic-addon2"
                    value={this.props.selectedPlayer.name}
                    onChange={(e) => this.handleSelectedPlayerFieldChange("name", e.target.value)}
                  />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-dark"
                      type="button"
                      title="Chiedi all'Oracolo"
                      onClick={() => this.handleOnRollPlayerGoal()}
                    >
                      <RollIcon /> Goal
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Obiettivo del personaggio"
                    aria-label="Obiettivo del personaggio"
                    aria-describedby="basic-addon2"
                    value={this.props.selectedPlayer.goal}
                    onChange={(e) => this.handleSelectedPlayerFieldChange("goal", e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-dark"
                      type="button"
                      title="Chiedi all'Oracolo"
                      onClick={() => this.handleOnRollPlayerRole()}
                    >
                      <RollIcon /> Role
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Character Role"
                    aria-label="Character Role"
                    aria-describedby="basic-addon2"
                    value={this.props.selectedPlayer.role}
                    onChange={(e) => this.handleSelectedPlayerFieldChange("role", e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-dark"
                      type="button"
                      title="Chiedi all'Oracolo"
                      onClick={() => this.handleOnRollPlayerDescriptor()}
                    >
                      <RollIcon /> Descriptor
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Character Descriptor"
                    aria-label="Character Descriptor"
                    aria-describedby="basic-addon2"
                    value={this.props.selectedPlayer.descriptor}
                    onChange={(e) => this.handleSelectedPlayerFieldChange("descriptor", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Stats;
