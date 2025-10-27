import React, { Component } from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  CardFooter,
  Col,
  Row,
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

class CardAdmin extends Component {
  render() {
    
    return (
      <React.Fragment>
        <Col  sm="2">
            <Link to={this.props.link}>
          <Card className="text-center">
            <CardBody>
            
             
            
              <h4 className="font-size-25 mb-1">
                
                  {this.props.name}
               
              </h4>

              <Row Col={8} style={{marginTop : 20}}>
                <Col>
                <h5 className="text">Paid</h5>
                </Col>

                <Col>
                <h5 className="text">{formatNumber(this.props.PaidAmount)}  {'('+this.props.PaidCount+')'}</h5>
                </Col>
              </Row>

              <Row Col={8} style={{marginTop : 5}}>
                <Col>
                <h5 className="text">Failure</h5>
                </Col>

                <Col>
                <h5 className="text">{formatNumber(this.props.FailureAmount)}  {'('+this.props.FailureCount+')'}</h5>
                </Col>
              </Row>

              <Row Col={8} style={{marginTop : 5}}>
                <Col>
                <h5 className="text">Pending</h5>
                </Col>

                <Col>
                <h5 className="text">{formatNumber(this.props.PendingAmount)}  {'('+this.props.PendingCount+')'}</h5>
                </Col>
              </Row>
             
             
           
                    </CardBody>
           
          </Card>
          </Link>
        </Col>
      </React.Fragment>
    )
  }
}

CardAdmin.propTypes = {
  user: PropTypes.object
}

export default CardAdmin
