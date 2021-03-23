import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AssetCard from "./assetCard";
import TitleBlock from "./titleBlock";
import _ from "lodash";

// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";

import ComboBox from "./icons";
import DefaultAsset from "../models/defaultAssets";
class AssetBuilder extends Component {
  state = {
    printableCards: [],
    trackLabelCursorPosition: 0,
    defaultAsset: new DefaultAsset(),
  };

  valueToStat(val, steps) {
    let n = 100 / (steps - 1);
    return val == 0 ? 0 : Math.round(val / n);
  }

  setPrintableCardSet(showBacks = true) {
    let cache = [];
    const printableCards = [];
    let assets = [...this.props.assets];
    let remainder = 9 - (assets.length % 9);
    if (remainder < 9) {
      for (let i = 0; i < remainder; i++) {
        assets.push(new DefaultAsset());
      }
    }
    for (let i = 0; i < assets.length; i++) {
      let asset = assets[i];
      let assetBack = { type: asset.Type, front: false };
      cache.push(assetBack);
      printableCards.push(asset);
      if ((i + 1) % 9 == 0) {
        for (let j = 0; j < cache.length; j++) {
          let assetBack = cache[j];
          printableCards.push(assetBack);
        }
        cache = [];
      }
    }
    this.setState({ printableCards });
  }

  handleStatTrackChange = (evt, name, steps, offset) => {
    let val = evt.target.value;
    let stat = this.valueToStat(val, steps);
    const assets = this.props.assets.map((a) => {
      if (a.id === name) {
        a.TrackValue = stat;
      }
      return a;
    });
    this.setState({ assets });
    this.setPrintableCardSet();
  };

  handleOnIconInputChange = (evt) => {
    if (evt === null) return;

    let value = evt.target.value;
    if (value === 0) {
      value = evt.target.children[0].dataset.value;
    }

    const selectedAsset = this.props.selectedAsset;
    selectedAsset.icon = value;
    this.setState({ selectedAsset });
    this.setPrintableCardSet();
  };

  handleOnTextInputChange = (evt, field) => {
    const selectedAsset = this.props.selectedAsset;
    selectedAsset[field] = evt.target.value;
    this.setState({ selectedAsset });
    this.setPrintableCardSet();
  };

  handleOnInputFieldNameInputChange = (evt, index) => {
    const selectedAsset = this.props.selectedAsset;
    selectedAsset.InputFields[index] = { name: evt.target.value, value: "" };
    this.setState({ selectedAsset });
    this.setPrintableCardSet();
  };

  handleOnAbilityInputChange = (evt, index, field) => {
    const selectedAsset = this.props.selectedAsset;
    selectedAsset.Abilities[index] = { ...selectedAsset.Abilities[index] };
    selectedAsset.Abilities[index][field] = evt.target.value;
    this.setState({ selectedAsset });
    this.setPrintableCardSet();
  };

  handleOnAbilityCheckboxChange = (evt, index) => {
    const selectedAsset = this.props.selectedAsset;
    selectedAsset.Abilities[index] = { ...selectedAsset.Abilities[index] };
    selectedAsset.Abilities[index].Enabled = evt.target.checked;
    this.setState({ selectedAsset });
    this.setPrintableCardSet();
  };

  getTrackLabels() {
    let out = "";
    this.props.selectedAsset.TrackLabels.map((l) => (out += l + "\n"));
    out.replace(/^\s+|\s+$/g, "");
    return out;
  }

  handleTrackLabelsChange = (evt) => {
    const selectedAsset = this.props.selectedAsset;
    selectedAsset.TrackLabels = selectedAsset.TrackLabels;

    this.setState({ trackLabelCursorPosition: evt.target.selectionStart });
    let text = evt.target.value.replace(/^\s+|\s+$/g, "");
    let labels = [];
    if (text !== "") labels = text.split("\n");

    selectedAsset.TrackLabels = labels;
    this.setState({ selectedAsset });
    this.setPrintableCardSet();
  };

  handleOnAddAsset = () => {
    const assets = this.props.assets;
    let asset = { ...this.props.selectedAsset };
    asset.id = this.getUserAssetId(asset.Name);
    asset.core = false;
    assets.push(asset);
    this.setState({ assets });
    this.props.onSelectedAssetChange(asset.id);
    this.setPrintableCardSet();
  };

  handleOnSaveChanges = () => {
    const assets = this.props.assets;
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (asset.id === this.props.selectedAsset.id) {
        assets[i] = { ...this.props.selectedAsset };
      }
    }
    this.setState({ assets });
    this.props.onSelectedAssetChange(this.props.selectedAsset.id);
    this.setPrintableCardSet();
  };

  handleOnDeleteUserAsset = () => {
    const assets = this.props.assets;
    let pos = -1;
    for (let i = 0; i < assets.length; i++) {
      let a = assets[i];
      if (a.id === this.props.selectedAsset.id) {
        pos = i;
      }
    }

    if (pos != -1) assets.splice(pos, 1);
    this.setState({ assets });
    this.props.onSelectedAssetChange("");
    this.setPrintableCardSet();
  };

  getUserAssetId(name) {
    return `user-${name.toLowerCase().replace(" ", "-")}`;
  }

  componentDidMount() {
    this.setPrintableCardSet();
  }

  componentDidUpdate() {
    let el = document.getElementById("tableEditor");
    el.setSelectionRange(this.state.trackLabelCursorPosition, this.state.trackLabelCursorPosition);
    this.props.onComponentUpdate();
  }

  handlePrint() {
    window.print();
  }
  render() {
    return (
      <React.Fragment>
        <h1 className="print-hide">Asset Builder</h1>
        <div className="row print-hide">
          {/* <div className="col-3"> */}
          <AssetCard
            asset={this.props.selectedAsset}
            onTrackProgressChange={() => {}}
            onInputFieldChange={() => {}}
            onAbilityCheckChange={() => {}}
            hideThumb={true}
            disabled={true}
            stat={{
              stat: -1,
              hideLabel: true,
              value: 0,
              trackLabels: this.props.selectedAsset.TrackLabels ? this.props.selectedAsset.TrackLabels : [],
            }}
          />
          {/* </div> */}
          <div className="col">
            <input id="id" type="hidden" />

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label className="btn btn-dark btn-tag">Select Existing Asset</label>
              </div>

              <select
                className="form-control"
                onChange={(e) => this.props.onSelectedAssetChange(e.target.value)}
                value={this.props.selectedAsset ? this.props.selectedAsset.id : -1}
              >
                <option val="">Select Asset</option>
                {this.props.assets.map((a) => (
                  <option value={a.id}>
                    {a.core ? "(Core)" : React.Fragment} {a.Name}
                  </option>
                ))}
              </select>
            </div>

            {/*  Cannot add if Name is blank, 
                Can only save changes if the selected assets is not a core asset, the asset Name
                cannot be different to the previous version, and the at least on other field
                must be different to the previous version
                */}
            <div id="assetBuilderControls" className="mb-4">
              {this.props.selectedAsset.Name === "" ||
              this.props.selectedAsset.core ||
              this.props.selectedAsset.id === -1 ||
              this.props.selectedAsset.id === "" ||
              this.props.selectedAsset.id !== this.getUserAssetId(this.props.selectedAsset.Name) ||
              _.isEqual(this.props.selectedAsset, this.state.defaultAsset) ||
              _.isEqual(
                this.props.selectedAsset,
                this.props.assets.find((a) => a.id === this.props.selectedAsset.id)
              ) ? (
                React.Fragment
              ) : (
                <React.Fragment>
                  <button className="btn btn-dark" onClick={() => this.handleOnSaveChanges()}>
                    <i class="fas fa-save"></i> Save Changes
                  </button>
                </React.Fragment>
              )}

              {/* Cannot add if Name is blank, Cannot add asset if selected asset is core asset. Cannot add if an asset exists with same name
              cannot add if the asset is same as default asset (ie no changes) cannot add if asset with same id already exists 
              add button is not shown when modifying an existing asset - copy shown instead*/}
              {this.props.selectedAsset.Name === "" ||
              this.props.selectedAsset.core ||
              this.props.selectedAsset.id === -1 ||
              this.props.selectedAsset.id != "" ||
              this.props.assets.find((a) => a.Name === this.props.selectedAsset.Name) != null ||
              _.isEqual(this.props.selectedAsset, this.state.defaultAsset) ||
              _.isEqual(
                this.props.selectedAsset,
                this.props.assets.find((a) => a.id === this.props.selectedAsset.id)
              ) ? (
                React.Fragment
              ) : (
                <React.Fragment>
                  <button className="btn btn-dark" onClick={() => this.handleOnAddAsset()}>
                    <i class="fas fa-plus"></i> Add Asset
                  </button>
                </React.Fragment>
              )}

              {/* Name cannot be blank, Cannot copy asset that does not exist 
              No asset can be selected              
              */}
              {this.props.selectedAsset.Name === "" ||
              this.props.selectedAsset.id === -1 ||
              this.props.selectedAsset.id === "" ||
              this.props.assets.find((a) => a.Name === this.props.selectedAsset.Name) != null ? (
                React.Fragment
              ) : (
                <React.Fragment>
                  <button className="btn btn-dark ml-2" onClick={() => this.handleOnAddAsset()}>
                    <i class="fas fa-copy"></i> Save As Copy
                  </button>
                </React.Fragment>
              )}

              {/* Delete Button not available on new assets or core assets */}
              {this.props.selectedAsset.core ||
              this.props.selectedAsset.id === -1 ||
              this.props.selectedAsset.id === "" ? (
                React.Fragment
              ) : (
                <React.Fragment>
                  <button className="btn btn-danger ml-2" onClick={() => this.handleOnDeleteUserAsset()}>
                    <i class="fas fa-minus"></i> Delete Asset
                  </button>
                </React.Fragment>
              )}
            </div>

            <Tabs defaultActiveKey="header" id="uncontrolled-tab-example">
              <Tab eventKey="header" title="Header">
                <div className="container">
                  <div className="row mt-4">
                    <div className="col">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <label className="btn btn-dark btn-tag">Type</label>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Asset Type"
                          aria-label="Name"
                          aria-describedby="basic-addon2"
                          value={this.props.selectedAsset.Type}
                          onChange={(e) => this.handleOnTextInputChange(e, "Type")}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <label className="btn btn-dark btn-tag">Name</label>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Asset Name"
                          aria-label="Name"
                          aria-describedby="basic-addon2"
                          value={this.props.selectedAsset.Name}
                          onChange={(e) => this.handleOnTextInputChange(e, "Name")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <label className="btn btn-dark btn-tag">Icon</label>
                    </div>
                    {ComboBox(this.props.selectedAsset, this.handleOnIconInputChange)}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="additional-info" title="Additional Info">
                <div className="container mt-4">
                  <div className="row">
                    <div className="col">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <label className="btn btn-dark btn-tag">Description</label>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Description (optional)"
                          aria-label="Name"
                          aria-describedby="basic-addon2"
                          value={this.props.selectedAsset.Description}
                          onChange={(e) => this.handleOnTextInputChange(e, "Description")}
                        />
                      </div>
                    </div>
                    <div className="container">
                      <div className="row">
                        <div className="col">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <label className="btn btn-dark btn-tag">1st Input Title</label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="User Input Title"
                              aria-label="Name"
                              aria-describedby="basic-addon2"
                              value={
                                this.props.selectedAsset.InputFields.length > 0
                                  ? this.props.selectedAsset.InputFields[0].name
                                  : ""
                              }
                              onChange={(e) => this.handleOnInputFieldNameInputChange(e, 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="row">
                        <div className="col">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <label className="btn btn-dark btn-tag">2nd Input Title</label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="User Input Title"
                              aria-label="Name"
                              aria-describedby="basic-addon2"
                              value={
                                this.props.selectedAsset.InputFields.length > 1
                                  ? this.props.selectedAsset.InputFields[1].name
                                  : ""
                              }
                              onChange={(e) => this.handleOnInputFieldNameInputChange(e, 1)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="abilities" title="Abilities">
                <div className="container mt-4">
                  <div className="row border-left-2 pl-2 py-2 my-4">
                    <div className="container">
                      <div className="row">
                        <div className="col-8">
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <label className="btn btn-dark btn-tag">Ability 1 Title</label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Title (Optional)"
                              aria-label="Name"
                              aria-describedby="basic-addon2"
                              value={
                                this.props.selectedAsset.Abilities.length > 0
                                  ? this.props.selectedAsset.Abilities[0].Name
                                  : ""
                              }
                              onChange={(e) => this.handleOnAbilityInputChange(e, 0, "Name")}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <input
                            type="checkbox"
                            //   name="cb"
                            id="cb_ability1"
                            checked={
                              this.props.selectedAsset.Abilities.length > 0 &&
                              this.props.selectedAsset.Abilities[0].Enabled == true
                                ? true
                                : false
                            }
                            onChange={(e) => this.handleOnAbilityCheckboxChange(e, 0)}
                          />
                          <label htmlFor={`cb_ability1`}>Checked</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <span className="modesto">Ability Text:</span>
                          <textarea
                            className="form-control"
                            placeholder="Ability 1 Text"
                            rows="3"
                            value={
                              this.props.selectedAsset.Abilities.length > 0
                                ? this.props.selectedAsset.Abilities[0].Text
                                : ""
                            }
                            onChange={(e) => this.handleOnAbilityInputChange(e, 0, "Text")}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row border-left-2 pl-2 py-2 my-4">
                    <div className="container">
                      <div className="row">
                        <div className="col-8">
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <label className="btn btn-dark btn-tag">Ability 2 Title</label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Title (Optional)"
                              aria-label="Name"
                              aria-describedby="basic-addon2"
                              value={
                                this.props.selectedAsset.Abilities.length > 0
                                  ? this.props.selectedAsset.Abilities[1].Name
                                  : ""
                              }
                              onChange={(e) => this.handleOnAbilityInputChange(e, 1, "Name")}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <input
                            type="checkbox"
                            //   name="cb"
                            id="cb_ability2"
                            checked={
                              this.props.selectedAsset.Abilities.length > 0 &&
                              this.props.selectedAsset.Abilities[1].Enabled == true
                                ? true
                                : false
                            }
                            onChange={(e) => this.handleOnAbilityCheckboxChange(e, 1)}
                          />
                          <label htmlFor={`cb_ability2`}>Checked</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <span className="modesto">Ability Text:</span>
                          <textarea
                            className="form-control"
                            placeholder="Ability 2 Text"
                            rows="3"
                            value={
                              this.props.selectedAsset.Abilities.length > 0
                                ? this.props.selectedAsset.Abilities[1].Text
                                : ""
                            }
                            onChange={(e) => this.handleOnAbilityInputChange(e, 1, "Text")}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row border-left-2 pl-2 py-2 my-4">
                    <div className="container">
                      <div className="row">
                        <div className="col-8">
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <label className="btn btn-dark btn-tag">Ability 3 Title</label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Title (Optional)"
                              aria-label="Name"
                              aria-describedby="basic-addon2"
                              value={
                                this.props.selectedAsset.Abilities.length > 0
                                  ? this.props.selectedAsset.Abilities[2].Name
                                  : ""
                              }
                              onChange={(e) => this.handleOnAbilityInputChange(e, 2, "Name")}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <input
                            type="checkbox"
                            //   name="cb"
                            id="cb_ability3"
                            checked={
                              this.props.selectedAsset.Abilities.length > 0 &&
                              this.props.selectedAsset.Abilities[2].Enabled == true
                                ? true
                                : false
                            }
                            onChange={(e) => this.handleOnAbilityCheckboxChange(e, 2)}
                          />
                          <label htmlFor={`cb_ability3`}>Checked</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <span className="modesto">Ability Text:</span>
                          <textarea
                            className="form-control"
                            placeholder="Ability 3 Text"
                            rows="3"
                            value={
                              this.props.selectedAsset.Abilities.length > 0
                                ? this.props.selectedAsset.Abilities[2].Text
                                : ""
                            }
                            onChange={(e) => this.handleOnAbilityInputChange(e, 2, "Text")}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="track" title="Track">
                <div className="container mt-4">
                  <div className="row">
                    <div className="col">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <label className="btn btn-dark btn-tag">Track Max Value</label>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="8"
                          steps="1"
                          className="form-control"
                          placeholder="Max Value"
                          aria-label="Name"
                          aria-describedby="basic-addon2"
                          disabled={
                            this.props.selectedAsset.TrackLabels &&
                            this.props.selectedAsset.TrackLabels.length > 0 &&
                            this.props.selectedAsset.TrackLabels[0] !== ""
                          }
                          value={
                            this.props.selectedAsset.TrackLabels &&
                            this.props.selectedAsset.TrackLabels.length > 0 &&
                            this.props.selectedAsset.TrackLabels[0] !== ""
                              ? this.props.selectedAsset.TrackLabels.length - 1
                              : this.props.selectedAsset.TrackMax
                          }
                          onChange={(e) => this.handleOnTextInputChange(e, "TrackMax")}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="modesto">Track Labels (Overrides Max Value):</span>
                        <textarea
                          id="tableEditor"
                          wrap="off"
                          value={
                            this.props.selectedAsset.TrackLabels && this.props.selectedAsset.TrackLabels.length > 0
                              ? this.getTrackLabels()
                              : ""
                          }
                          // value={this.props.oracles.getOracleTablePrompts(this.props.oracles.selectedOracleTable)}
                          onChange={(e) => this.handleTrackLabelsChange(e)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="help" title="Help">
                <div className="alert alert-light">
                  Assets with (Core) in the name cannot be edited or deleted. They are centrally maintained by the{" "}
                  <strong>Data Management</strong> page. To update assets got to the <strong>Data Management</strong>{" "}
                  page and press <strong>Update Core Assets</strong>
                  <br />
                  <br /> To create a new Asset either fill out the various fields and press <strong>
                    Save Asset
                  </strong>{" "}
                  or select an existing asset, make the required changes and press <strong>Save Asset.</strong> As you
                  make changes, those changes will be reflect live on the card nearest the input form. Use this to
                  ensure your content fits inside the card (so that it will display/print correctly).
                  <br />
                  <br />
                  <strong>Assets MUST have a unique name</strong>. Therefore you will be unable to click{" "}
                  <strong>Save Asset.</strong> unless a unique name is chosen.
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
        <div id="assetCards" className="print-hide mb-5">
          <TitleBlock title="Asset Deck" />
          <div className="alert alert-secondary">Use this section to print cards</div>
          <a class="print-hide btn btn-dark" title="Print" onClick={() => this.handlePrint()}>
            Print Cards
          </a>
        </div>

        {this.state.printableCards.map((a) => {
          if (a.front)
            return (
              <AssetCard
                asset={a}
                hideThumb={true}
                disabled={true}
                stat={{
                  stat: a.id,
                  hideLabel: true,
                  value: a.trackValue,
                  trackLabels: a.TrackLabels ? a.TrackLabels : [],
                }}
                onTrackProgressChange={() => {}}
                onInputFieldChange={() => {}}
                onAbilityCheckChange={() => {}}
              />
            );
          else {
            return (
              <React.Fragment>
                <div className="card asset-card asset-card-back text-center print-show">
                  <h3>IRONSWORN</h3>
                  <div className="asset-icon">
                    <i
                      class={`game-icon game-icon-croc-sword`}
                      // aria-hidden="true"
                    ></i>
                  </div>
                  <div className="hr"></div>

                  <h1 className="mt-5">{a.type}</h1>
                </div>
              </React.Fragment>
            );
          }
        })}

        <div class="page-break"></div>

        {/* </div> */}
        {/* </div> */}
      </React.Fragment>
    );
  }
}

export default AssetBuilder;
