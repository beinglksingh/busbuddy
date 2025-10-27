import React, { Component } from "react"
import ReactEcharts from "echarts-for-react"

class Pie extends Component {
  getOption = () => {
    return {
      toolbox: {
        show: false,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["AEPS", "DMR", "RECHARGE", "INDONEPAL"],
        textStyle: {
          color: ["#74788d"],
        },
      },
      color: ["#f46a6a", "#34c38f", "#50a5f1", "#f1b44c", "#556ee6"],
      series: [
        {
          name: "Total sales",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            { value: this.props.AEPS, name: "Success" },
            { value: this.props.DMR, name: "Failure" },
            { value: this.props.RECHARGE, name: "Pending" }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    }
  }
  render() {
    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={this.getOption()} />
      </React.Fragment>
    )
  }
}
export default Pie