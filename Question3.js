// create 2 data_set
var data1 = [
  { group: "United Kindom", value: 124 },
  { group: "Canada", value: 49 },
  { group: "France", value: 40 },
  { group: "India", value: 31 },
  { group: "Germany", value: 20 },
  { group: "Australia", value: 18 },
  { group: "China", value: 18 },
  { group: "Hong Kong", value: 14 },
  { group: "Japan", value: 11 },
  { group: "Belgium", value: 10 }
];

var data2 = [
  { group: "United Kindom", value: 46 },
  { group: "Canada", value: 25 },
  { group: "Germany", value: 20 },
  { group: "India", value: 19 },
  { group: "France", value: 17 },
  { group: "Australia", value: 13 },
  { group: "China", value: 12 },
  { group: "Hong Kong", value: 8 },
  { group: "South Korea", value: 6 },
  { group: "Indonesia", value: 5 }
];

var data3 = [
  { group: "United Kindom", value: 116 },
  { group: "Canada", value: 70 },
  { group: "France", value: 53 },
  { group: "Germany", value: 43 },
  { group: "India", value: 36 },
  { group: "Australia", value: 21 },
  { group: "China", value: 17 },
  { group: "Belgium", value: 14 },
  { group: "Spain", value: 12 },
  { group: "Italy", value: 11 }
];

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 90 },
  width = 700 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#Question3")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
// set the ranges
var y = d3.scaleBand()
  .range([height, 0])
  .padding(0.2);

var yAxis = svg3.append("g")
  .attr("class", "myYaxis")

var xAxis = svg3.append("g")
  .attr("transform", "translate(0," + height + ")")

var x = d3.scaleLinear()
  .range([0, width]);

svg3.append("text")
  .attr("transform",
    "translate(" + (width / 2) + " ," +
    (height + margin.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Total number of contents");

// A function that create / update the plot for a given variable:
function update(data) {

  // Update the X axis
  x.domain([0, d3.max(data, function (d) { return d.value + 8; })])
  xAxis.transition().duration(1000).call(d3.axisBottom(x))

  // Update the Y axis
  y.domain(data.map(function (d) { return d.group; }));
  yAxis.transition().duration(1000).call(d3.axisLeft(y));




  // Create the u variable
  var u = svg3.selectAll("rect")
    .data(data)

  u
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(u) // get the already existing elements as well
    .transition() // and apply changes to all of them
    .duration(1000)
    //.attr("x", function(d) { return x(d.value); })
    .attr("y", function (d) { return y(d.group); })
    .attr("width", function (d) { return x(d.value); })
    .attr("height", y.bandwidth() - 7)
    .attr("fill", "#CD6155")//


  // If less group in the new dataset, I delete the ones not in use anymore
  u
    .exit()
    .remove()
}

// Initialize the plot with the first dataset
update(data1)
