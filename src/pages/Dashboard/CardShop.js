import React, { Component } from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row, Col, Card } from "reactstrap"

class CardShop extends Component {
  render() {
console.log('color' , this.props.shop.Color);

    const name = this.props.shop.Name
    const nameIcon = name.charAt(0)
    return (
      <React.Fragment>
        <Col xl="2" sm="2">
          <Card >
            <Row>
             
              <Link to="#" value={this.props.shop} className="mr-3 text-primary" onClick={() => this.props.selectcompany(this.props.shop)}>
                <div className="text-center p-4 border-end" id={"div"+this.props.shop.Id}  style={{backgroundColor:this.props.colors}}>
                  <div className="avatar-sm mx-auto mb-3 mt-1">
                    <span
                      className={
                        "avatar-title rounded-circle bg-soft bg-" +
                        this.props.shop.Color +
                        " primary text-" +
                        this.props.shop.Color +
                        " font-size-16"
                      }
                    >
                      {nameIcon}
                    </span>
                  </div>
                  <h5 className="text-truncate pb-1">{this.props.shop.Name}</h5>
                </div>
                </Link>
             

            </Row>
          </Card>
        </Col>
      </React.Fragment>
    )
  }
}

CardShop.propTypes = {
  shop: PropTypes.object,
  selectcompany : PropTypes.func,
  colors : PropTypes.string
}

export default CardShop
