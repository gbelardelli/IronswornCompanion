import React, { Component } from "react";
import TitleBlock from "./titleBlock";
import Character from "../models/character";
import { HashRouter, Link } from "react-router-dom";
import DangerButton from "./dangerButton";
import RollIcon from "./rollIcon";
class Characters extends Component {
  //TODO: implement props.newPlayer

  constructor(props) {
    super();
    if (props.newPlayer.Stats == null) this.resetNewPlayer(props);
  }
  getNewStats() {
    return [
      { id: 1, type: "core", stat: "Destrezza", value: 0 },
      { id: 2, type: "core", stat: "Cuore", value: 0 },
      { id: 3, type: "core", stat: "Ferro", value: 0 },
      { id: 4, type: "core", stat: "Ombra", value: 0 },
      { id: 5, type: "core", stat: "Ingegno", value: 0 },
      { id: 6, type: "status", stat: "Vita", value: 5 },
      { id: 7, type: "status", stat: "Spirito", value: 5 },
      { id: 8, type: "status", stat: "Risorse", value: 5 },
      { id: 9, type: "status", stat: "Impeto", value: 2 },
    ];
  }

  handleAddCharacter = () => {
    const players = this.props.players;
    const player = new Character();
    player.name = this.props.newPlayer.Name;
    player.role = this.props.newPlayer.Role;
    player.goal = this.props.newPlayer.Goal;
    player.descriptor = this.props.newPlayer.Descriptor;
    player.failure = 0;
    player.failureRoll = null;
    player.inventory = [];
    player.stats = this.props.newPlayer.Stats.map((s) => {
      if (s.value === "" || s.value < 0) s.value = 0;
      else if (s.value > 4 && s.type !== "status") s.value = 4;
      return s;
    });
    if (this.props.newPlayer.Name !== "" && !players.find((p) => p.name === this.props.newPlayer.Name)) {
      players.push(player);
      this.setState({ players: players });
      this.resetNewPlayer();
    }
    this.props.addLog("event", `${player.name} inizia il suo viaggio nelle Ironlands`);
  };

  resetNewPlayer(props = null) {
    const newPlayer = props !== null ? props.newPlayer : this.props.newPlayer;
    newPlayer.Name = "";
    newPlayer.Role = "";
    newPlayer.Goal = "";
    newPlayer.Descriptor = "";
    newPlayer.Stats = this.getNewStats();
    this.setState({ newPlayer });
  }

  handlePlayerDelete = (playerName) => {
    const players = this.props.players;
    let pos = -1;
    for (let i = 0; i < players.length; i++) {
      let p = players[i];
      if (p.name === playerName) {
        pos = i;
      }
    }

    if (pos !== -1) players.splice(pos, 1);

    this.setState({ players: players });
  };

  handleOnRollPlayerName = () => {
    const newPlayer = this.props.newPlayer;
    let rn = this.props.oracles.IronlanderName;
    newPlayer.Name = rn;
    this.setState({ newPlayer });
  };

  handleNewPlayerNameChanged = (evt) => {
    const newPlayer = this.props.newPlayer;
    newPlayer.Name = evt.target.value;
    this.setState({ newPlayer });
  };

  handleOnRollPlayerRole = () => {
    const newPlayer = this.props.newPlayer;
    let rn = this.props.oracles.CharacterRole;
    newPlayer.Role = rn;
    this.setState({ newPlayer });
  };

  handleNewPlayerRoleChanged = (evt) => {
    const newPlayer = this.props.newPlayer;
    newPlayer.Role = evt.target.value;
    this.setState({ newPlayer });
  };

  handleOnRollPlayerGoal = () => {
    const newPlayer = this.props.newPlayer;
    let rn = this.props.oracles.CharacterGoal;
    newPlayer.Goal = rn;
    this.setState({ newPlayer });
  };

  handleNewPlayerGoalChanged = (evt) => {
    const newPlayer = this.props.newPlayer;
    newPlayer.Goal = evt.target.value;
    this.setState({ newPlayer });
  };

  handleOnRollPlayerDescriptor = () => {
    const newPlayer = this.props.newPlayer;
    let rn = this.props.oracles.CharacterDescriptor;
    newPlayer.Descriptor = rn;
    this.setState({ newPlayer });
  };

  handleNewPlayerDescriptorChanged = (evt) => {
    const newPlayer = this.props.newPlayer;
    newPlayer.Descriptor = evt.target.value;
    this.setState({ newPlayer });
  };

  handleOnRollPlayerPrimaryStat = () => {
    let rn = this.props.oracles.PrimaryStat;
    const newPlayerStats = this.props.newPlayer.Stats.map((s) => {
      if (s.type === "core") s.value = s.id === rn ? 3 : 0;
      return s;
    });
    this.setState({ newPlayerStats });
  };

  handleNewPlayerStatChanged = (evt) => {
    let statName = evt.target.getAttribute("data-name");
    const newPlayerStats = this.props.newPlayer.Stats.map((s) => {
      if (s.stat === statName) s.value = evt.target.value;
      return s;
    });
    this.setState({ newPlayerStats });
  };

  getSelectedPlayer() {
    return this.props.players.find((p) => p.selected);
  }

  componentDidUpdate() {
    this.props.onComponentUpdate();
  }

  render() {
    return (
      <React.Fragment>
        <h1>Personaggi</h1>
        <div className="row">
          <div className="col">
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
                      <RollIcon /> Nome
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nome del personagggio"
                    aria-label="Name"
                    aria-describedby="basic-addon2"
                    value={this.props.newPlayer.Name}
                    onChange={(e) => this.handleNewPlayerNameChanged(e)}
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
                      <RollIcon /> Obiettivo
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Obiettivo del personaggio"
                    aria-label="Character Goal"
                    aria-describedby="basic-addon2"
                    value={this.props.newPlayer.Goal}
                    onChange={(e) => this.handleNewPlayerGoalChanged(e)}
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
                      <RollIcon /> Ruolo
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ruolo del personaggio"
                    aria-label="Character Role"
                    aria-describedby="basic-addon2"
                    value={this.props.newPlayer.Role}
                    onChange={(e) => this.handleNewPlayerRoleChanged(e)}
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
                      <RollIcon /> Descrittore
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descrittore del personaggio"
                    aria-label="Character Descriptor"
                    aria-describedby="basic-addon2"
                    value={this.props.newPlayer.Descriptor}
                    onChange={(e) => this.handleNewPlayerDescriptorChanged(e)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="alert alert-secondary">
                  Un personaggio ha cinque caratteristiche in totale. Ognuna può assumere un valore da 1 a 4 (in base al
                  livello). Per iniziare, scegli una difficoltà e assegna i bonus di quella difficoltà alle cinque
                  caratteristiche nell'ordine che vuoi. Puoi anche chiedere all'Oracolo di scegliere per te la tua
                  caratteristica primaria.
                  <div className="difficulty-tags">
                    <div className="row">
                      <div className="col-12">
                        <div className="btn-group btn-group-justified">
                          <button className="btn btn-block btn-secondary btn-tag">FACILE</button>
                          <button className="btn btn-block btn-dark btn-tag">4,3,3,2,2</button>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="btn-group btn-group-justified">
                          <button className="btn btn-block btn-secondary btn-tag">PERICOLOSO</button>
                          <button className="btn btn-block btn-dark btn-tag">3,2,2,1,1</button>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="btn-group btn-group-justified">
                          <button className="btn btn-block btn-secondary btn-tag">IMPOSSIBILE</button>
                          <button className="btn btn-block btn-dark btn-tag">3,2,1,1,0</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-2 col-sm-12">
                <h6>&nbsp;</h6>
                <button
                  className="btn btn-dark btn-block mt-4"
                  type="button"
                  onClick={() => this.handleOnRollPlayerPrimaryStat()}
                >
                  <RollIcon /> Statistica primaria
                </button>
              </div>
              {this.props.newPlayer.Stats.filter((s) => s.type === "core").map((s) => (
                <div className="col-lg-2 col-sm-12">
                  <h6 className="mt-3">{s.stat.toUpperCase()}</h6>
                  <input
                    data-name={s.stat}
                    className="form-control"
                    type="number"
                    min="1"
                    max="4"
                    value={s.value === 0 ? "" : s.value}
                    placeholder={s.stat}
                    onChange={(e) => this.handleNewPlayerStatChanged(e)}
                  />
                </div>
              ))}
            </div>
            <div className="row mt-5">
              <div className="col">
                <button className="btn btn-dark" type="button" onClick={() => this.handleAddCharacter()}>
                  <i className="fas fa-plus" aria-hidden="true"></i>
                  &nbsp;Aggiungi personaggio
                </button>
              </div>
            </div>
          </div>
        </div>
        <TitleBlock title="SELEZIONA PERSONAGGIO" />

        <div className="row mt-4">
          {this.props.players.map((player) => (
            <div key={player.name} className="col-lg-6 col-sm-12">
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="mb-2">{player.name}</h4>
                  <p>
                    <span className="modesto">Ruolo: </span>
                    <span>{player.role}</span>
                  </p>
                  <p>
                    <span className="modesto">Obiettivo: </span>
                    <span>{player.goal}</span>
                  </p>
                  <p>
                    <span className="modesto">Descrittore: </span>
                    <span>{player.descriptor}</span>
                  </p>
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      <HashRouter basename="/">
                        <Link
                          to="/stats"
                          className="btn btn-dark btn-block"
                          onClick={() => this.props.onPlayerSelect(player.name)}
                        >
                          <i className="fas fa-user-plus" aria-hidden="true"></i>
                          &nbsp;Seleziona
                        </Link>
                      </HashRouter>
                      {/* <button
                        className="btn btn-dark btn-block"
                        onClick={() => this.props.onPlayerSelect(player.name)}
                      >
                        <i className="fas fa-user-plus" aria-hidden="true"></i>
                        &nbsp;Select
                      </button> */}
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <DangerButton
                        buttonText="Elimina"
                        additionalButtonClasses="btn-block"
                        iconClass="fas fa-times"
                        onDangerClick={this.handlePlayerDelete}
                        deleteId={player.name}
                        deleteMessage="Sicuro di eliminare il personaggio?"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Characters;
