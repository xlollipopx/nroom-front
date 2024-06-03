import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./Home.css";

class Home extends Component {


   navigateToChat = () => {
    this.props.history.push("/chat");
  }

  renderCircles() {
    return (
      <div className="container">
        <div className="graf-bg-container">
          <div className="graf-layout">
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
            <div className="graf-circle"></div>
          </div>
        </div>
        <button className="home-title" onClick={this.navigateToChat}>Chat Now!</button>
      </div>
    );
  }

  render() {
    return <div className="home-container">{this.renderCircles()}</div>;
  }
}

export default Home;
