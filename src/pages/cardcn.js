import React, { Component } from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  UncontrolledTooltip,
} from "reactstrap"


function formatNumber(number) {
    if (!number) {
      return "0";
    }
    
  
    // Convert the input to a number if it's not already
    const numericValue = parseFloat(number);
  
    // Check if the numericValue is a valid number
    if (!isNaN(numericValue)) {
      // Format the number with commas for thousands and add the rupee sign
      return "₹" + numericValue.toLocaleString("en-IN");
    } else {
      // Handle the case where the input is not a valid number
      return "Invalid Number";
    }
  }

class CardContact extends Component {
  render() {
    
    return (
      <React.Fragment>
        <Col  sm="2">
            <Link to={this.props.link}>
          <Card className="text-center">
            <CardBody>
            
                <div className="mb-4">
                  <img
                    width={100}
                    height={100}
                    src={this.props.src}
                    alt=""
                  />
                </div>
            

              <h4 className="font-size-25 mb-1">
                
                  {this.props.name}
               
              </h4>
              <h5 className="text-muted">{formatNumber(this.props.data)}</h5>
              <h6 className="text-muted">{'('+this.props.count+')'}</h6>

                    </CardBody>
           
          </Card>
          </Link>
        </Col>
      </React.Fragment>
    )
  }
}

CardContact.propTypes = {
  user: PropTypes.object
}

export default CardContact
