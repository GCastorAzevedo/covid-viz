import * as d3 from "d3";
import data from "./data";
import "../public/style.css";

//  TODO: implement the plot https://observablehq.com/@d3/ridgeline-plot,
// also https://bl.ocks.org/armollica/3b5f83836c1de5cca7b1d35409a013e3
//  TODO: implement transitions in the style of https://observablehq.com/@d3/streamgraph-transitions
// so to animate the graph of quantum states

const margin = {
  top: 50,
  right: 30,
  left: 30,
  bottom: 30,
};
const width = 1060 - margin.left - margin.right;
const height = 6000 - margin.top - margin.bottom;
const overlap = 26;
const amplitude = height / 200;

function randomize(data) {
  return () => {
    const randomData = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      randomData[i] = data[Math.floor(Math.random() * data.length)];
    }
    return randomData;
  };
}

async function draw() {
  const columns = data["Row Labels"];
  delete data["Row Labels"];
  const countries = Object.keys(data);
  for (let country of countries) {
    data[country] = data[country]
      .map((value) => parseInt(value))
      .map((value) => (isNaN(value) ? 0 : value));
    data[country] = data[country].concat([0]);
  }
  console.log(Object.values(data).slice(0, 20));

  const x = d3
    .scaleLinear()
    .domain([0, columns.length - 1])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scalePoint()
    .domain(countries.map((c, i) => i))
    .range([margin.top, height - margin.bottom]);

  const z = d3
    .scaleLinear()
    .domain([
      d3.min(countries, (country) => d3.min(data[country])),
      d3.max(countries, (country) => d3.max(data[country])),
    ])
    .range([0, -overlap * y.step()]);

  d3.select("#dataviz")
    .append("h1")
    .attr("class", "title")
    .text("Covid 19 very sad statistics");

  const svg = d3
    .select("#dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const graphs = (g) => {
    return g
      .append("g")
      .attr("class", "stats")
      .attr("transform", (d, i) => `translate(0,${y(i) + 1})`)
      .append("path")
      .attr("fill", "#ddd")
      .attr("opacity", ".99")
      .attr("stroke", "#000")
      .attr("stroke.width", 1)
      .attr("stroke-linejoin", "round")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d, i) => x(i))
          .y(z)
      );
  };

  svg
    .append("g")
    .attr("class", "graphs")
    .attr("transform", `translate(${margin.left},${margin.bottom})`)
    .selectAll(".stats")
    .data(Object.values(data).slice(0, 20))
    .enter()
    .call(graphs);

  // svg
  //   .append("g")
  //   .attr("margin-top", margin.top)
  //   .attr("transform", `translate(${margin.left},${height})`)
  //   .call(d3.axisBottom(x));

  // let s = 0;
  // while (s < 50) {
  //   await d3
  //     .selectAll("path")
  //     .data(randomize(data))
  //     .transition()
  //     .duration(1000)
  //     .attr(
  //       "d",
  //       d3
  //         .line()
  //         .curve(d3.curveBasis)
  //         .x((d, i) => x(i))
  //         .y(z)
  //     )
  //     .end();
  //   s++;
  // }
}

draw();
