function drawChart2() {
  // used to format numbers to two decimal places
  var formatDecimal = d3.format(",.2f");

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 150, bottom: 60, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#Question2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv("https://raw.githubusercontent.com/ChengruiWU990531/fit5145_data/main/Question2.csv", function (data) {

    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, 0])
      .range([0, width]);
    svg.append("g")
      .attr("class", "myXaxis")// Note that here we give a class to the X axis, to be able to call it later and modify it
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .attr("opacity", "0");//<==

    // Add X axis label:
    svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Number of crime-related contents");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 0])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "myYaxis")
      .attr("opacity", "0");

    // Add Y axis label:
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5 - margin.left)
      .attr("x", 20 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Intentional homicide rate (per 100,000 population)");

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
      .domain([10, 800])
      .range([4, 17]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
      .domain(["Africa", "Americas", "Asia", "Europe", "Oceania"])
      .range(d3.schemeTableau10);


    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("div.tooltip");

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (d) {
      tooltip
        .style("visibility", "visible")
        .html("Country: " + d.country + "<br>" +
          "Crime Rate: " + formatDecimal(d.homicide_rate) + "<br>" +
          "Number of crime-related contents created: " + d.num_crime_contents + "<br>" +
          "Total number of contents created: " + d.total_num_contents)
        .style("top", (d3.event.pageY) + "px")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("position", "absolute")
      d3.select(this).duration(200)
    }
    var moveTooltip = function (d) {
      tooltip
        .style("top", (d3.event.pageY) + "px")
        .style("left", (d3.event.pageX + 10) + "px")
    }
    var hideTooltip = function (d) {
      tooltip
        .style("visibility", "hidden")
    }

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function (d) { return "bubbles " + d.continent })
      .attr("cx", function (d) { return x(d.num_crime_contents); })
      .attr("cy", function (d) { return y(d.homicide_rate); })
      .attr("r", function (d) { return z(d.total_num_contents); })
      .style("fill", function (d) { return myColor(d.continent); })
      // -3- Trigger the functions for hover
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)


    //reset x domain
    x.domain([0, 50])
    svg.select(".myXaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisBottom(x));

    y.domain([0, 35])
    svg.select(".myYaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisLeft(y));


    svg.selectAll("circle")
      .transition()
      .delay(function (d, i) { return (i * 3) })
      .duration(2000)
      .attr("cx", function (d) { return x(d.num_crime_contents); })
      .attr("cy", function (d) { return y(d.homicide_rate); })

    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function (d) {
      // reduce opacity of all groups
      d3.selectAll(".bubbles").style("opacity", .05)
      // expect the one that is hovered
      d3.selectAll("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function (d) {
      d3.selectAll(".bubbles").style("opacity", 1)
    }


    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add one dot in the legend for each name.
    var size = 20
    var allgroups = ["Africa", "Americas", "Asia", "Europe", "Oceania"]
    svg.selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
      .attr("cx", 500)
      .attr("cy", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function (d) { return myColor(d) })
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
      .attr("x", 500 + size * .8)
      .attr("y", function (d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) { return myColor(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)
  })
}
function init() {
  drawChart2();
}

init()