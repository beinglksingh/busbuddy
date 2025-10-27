import React, { Component } from 'react';
import './BusCard.css'; // create this CSS file

class BusCard extends Component {
  render() {
    const name = this.props.name;
    const type = this.props.type;
    const timeD = this.props.timeD;
    const timeA = this.props.timeA;
    const duration = this.props.duration;
    const rate = this.props.rate;
    const getseats = this.props.getseats;
    const traceId = this.props.traceId;
    const bpid = this.props.bpid;
    const dpid = this.props.dpid;
    const bpname = this.props.bpname;
    const dpname = this.props.dpname;
    const busId = this.props.busId;
    
    const cutrate = Number(this.props.rate)+250;

    return (
      <div className="bus-card">
        <div className="left-section">
          <span className="primo">Primo</span>
          <h3>{name}</h3>
          <p className="bus-type">{type}</p>
        </div>

        <div className="middle-section">
          <span className="rating">★ 4.1</span>
          <div className="timing">
            <strong>{timeA}</strong> &mdash; <strong>{timeD}</strong>
          </div>
          <div className="duration-seats">{duration} · 10 Seats</div>
        </div>

        <div className="right-section">
          <div className="offer">Try new <strong>10% OFF</strong></div>
          <div className="price">
            <span className="original">₹{cutrate}</span>
            <span className="discounted">₹{rate}</span>
          </div>
          <button className="view-seats-btn" type='button'  onClick={() => getseats(traceId, busId, bpid, dpid,name,type, bpname ,dpname)}>View seats</button>
        </div>
      </div>
    );
  }
}

export default BusCard;
