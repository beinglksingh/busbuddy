import React, { Component } from "react"
import {
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
} from "reactstrap"
import { Col, Card , CardBody , Alert, Row } from "reactstrap";
import { Fn_FillListData } from "../../store/functions";
import { API_WEB_URLS } from "../../constants/constAPI";
import { compose } from "recompose";
import { container } from "../../store/Containers/cntCommon";



// Carousel images
import img1 from "../../assets/images/1.jpg"
import img2 from "../../assets/images/2.jpg"
import img3 from "../../assets/images/3.jpg"
import img4 from "../../assets/images/4.jpg"

const items = [
  
  {
    src: img2,
   
  },
  {
    src: img3,
    
  },
  {
    src: img4,
   
  },
]

class CarouselPage extends Component {
  constructor(props) {
    super(props)
    
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.goToIndex = this.goToIndex.bind(this)
    this.onExiting = this.onExiting.bind(this)
    this.onExited = this.onExited.bind(this);
    this.state = {
        GlobalOptions : [
          {
            LoginPageLine1 : '',
            LoginPageLine2: ''
          }
        ],

        items : [{
    src: img1,
   
  },
  {
    src: img2,
   
  },
  {
    src: img3,
    
  },
  {
    src: img4,
   
  }],
        activeIndex: 0
      
  
      };
      this.obj = this;
  }

  componentDidMount() {

    

    // Filling DropDowns
    
    // Fn_FillListData(this.obj, "GlobalOptions", API_WEB_URLS.MASTER + "/0/token/GlobalOptions/Id/0");
 
 
    // Fn_FillListData(this.obj, "items", API_WEB_URLS.MASTER + "/0/token/LoginIMG/Id/0");
    
    
    
  }


  onExiting() {
    this.animating = true
  }

  onExited() {
    this.animating = false
  }

  next() {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === this.state.items.length - 1
        ? 0
        : this.state.activeIndex + 1
    this.setState({ activeIndex: nextIndex })
  }

  previous() {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.items.length - 1
        : this.state.activeIndex - 1
    this.setState({ activeIndex: nextIndex })
  }

  goToIndex(newIndex) {
    if (this.animating) return
    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    

    const slides = items.map(item => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
    <img
  src={item.src}
  style={{ maxWidth: '100%', maxHeight: '100%', height: '1800px !important', width: '1200px !important' }}
  className="d-block img-fluid"
  
/>
        </CarouselItem>
      )
    })

    return (
 

<React.Fragment>
        <Col xl={9}>
          <div className="auth-full-bg pt-lg-5 p-4">
            <div className="w-100">
              
            
                <div className="p-4 mt-auto">
                 
                    
                      
                        
                       
        <Carousel
          activeIndex={activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators
            items={this.state.items}
            activeIndex={activeIndex}
            onClickHandler={this.goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={this.previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={this.next}
          />
        </Carousel>


        {/* <Row>

<div className="" style={{marginTop:20}}>
<Alert className="alert-success" role="alert">

  <p>{this.state.GlobalOptions[0].LoginPageLine1}</p>
  <hr />
  <p className="mb-0">{this.state.GlobalOptions[0].LoginPageLine2}</p>
</Alert>
</div>
</Row> */}
                       
                        
                     
                    </div>
                  </div>
                 
                </div>

               
                
            
           
          </Col>
      </React.Fragment>
    )
  }
}

export default compose(container)(CarouselPage);

