import React, { Component } from "react";
import { connect } from "react-redux";
import "./linegraph.styles.css";
import * as d3 from "d3";

var height = 600;
var width = 600;
var padding = 90;
var tooltip = d3.select("body").append("div").classed("tooltip", true);

var arr = null;
var self = null;

class BarChart extends Component {
  componentDidMount() {
    // arr=this.props.attendance;
    // console.log(arr)
    // // arr.
    arr = [
      {
        date: "6/1/20",
        presentStudent: 6282981,
      },
      {
        date: "6/2/20",
        presentStudent: 6403944,
      },
      {
        date: "6/3/20",
        presentStudent: 6522099,
      },
      {
        date: "6/4/20",
        presentStudent: 6649014,
      },
      {
        date: "6/5/20",
        presentStudent: 6779972,
      },
      {
        date: "6/6/20",
        presentStudent: 6915760,
      },
      {
        date: "6/7/20",
        presentStudent: 7027674,
      },
    ];
    //preparing pre-requisites for x and y axis
    var scalex = d3
      .scaleTime()
      .domain([new Date(2020, 5, 1), new Date(2020, 5, 8)])
      .range([padding, width - padding]);
    var scaley = d3
      .scaleLinear()
      .domain([0, this.props.totalStudent])
      .range([height - padding, padding]);

    var xaxis = d3.axisBottom(scalex).ticks(5);
    var yaxis = d3.axisLeft(scaley);

    d3.select(this.refs.canvas)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    // plotting x and y axis on the graph
    d3.select("svg")
      .append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xaxis);
    d3.select("svg")
      .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yaxis);

    // plotting the x-info and the y-info
    d3.select("svg")
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - padding)
      .attr("dy", "3.5em")
      .style("text-anchor", "middle")
      .text("-------------Month-------------->");

    d3.select("svg")
      .append("text")
      .attr("y", padding)
      .attr("x", -height / 2)
      .attr("dy", "-4.5em")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("------------Attendance Graph------------>");

    this.drawgraph(scalex, scaley);
  }

  drawgraph = (scalex, scaley) => {
    self = this;
    d3.select("svg")
      .selectAll("rect")
      .data(arr)
      .enter()
      .append("circle")
      .on("mousemove", this.changeradius1)
      .on("touchstart", this.changeradius1)
      .on("mouseout", this.changeradius2)
      .on("touchend", this.changeradius2)
      .transition()
      .duration(1500)
      .attr("cx", (d) => {
        var month = parseInt(d.date.substring(0, 1)) - 1;
        var date = parseInt(d.date.substring(2, 3).replace("/", ""));
        return scalex(new Date(2020, month, date));
      })
      .attr("cy", (d) => scaley(d["presentStudent"]))
      .attr("r", 5)
      .attr("fill", "White")
      .attr("stroke", "#000")
      .attr("stroke-width", "1.9");
  };

  changeradius1(event, d, i) {
    d3.select(this).attr("r", 12);
    self.showtooltip(d, i, event);
  }

  changeradius2() {
    d3.select(this).attr("r", 5);
    tooltip.style("opacity", 0);
  }

  showtooltip(d, i, node) {
    console.log(node.x - tooltip.node().offsetWidth / 2 - 5);
    tooltip
      .style("opacity", 1)
      .style("left", node.x - tooltip.node().offsetWidth / 2 - 5 + "px")
      .style("top", node.y + 25 + "px")
      .html(
        `
                <p>Date: ${d.date}</p>
                <p>Total Present Student: ${d.presentStudent}</p>
                `
      );
  }
  render() {
    return <div ref="canvas"></div>;
  }
}

// const mapStateToProps= (state)=>({
//     attendance:state.graphReducer.attendance
// })

export default BarChart;
