// The svg4
var svg4 = d3.select("#Question4"),
    width = +svg4.attr("width"),
    height = +svg4.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth1()
    .scale(150)
    .center([10, 0])
    .translate([width / 2, height / 2]);

// Data and color scale
var legend = [0, 10, 25, 50, 70, 80, 90, 100];
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain(legend)
    .range(d3.schemeReds[legend.length]);

for (let i = 0; i < legend.length; i++) {
    let colorSquare = document.createElement('div');
    colorSquare.innerHTML = `<span class="color-box" style="background-color: ${d3.schemeReds[legend.length][i]}"></span>${legend[i]}`;
    document.getElementById('legend').appendChild(colorSquare);
}

//create a tooltip
var tooltip = d3.select("div.tooltip");

// Load external data and boot
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/ChengruiWU990531/fit5145_data/main/Question4.csv", function (d) {
        data.set(d.code, +d.value);
    })
    .await(ready);


function ready(error, topo) {

    // Draw the map
    svg4.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function (d) {
            return "Country"
        })
        .style("opacity", .8)

        .on("mouseover", function (d) {
            console.log(d)
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")
            tooltip.style("hidden", false).html(d.properties.name + ': ' + d.total);
        })

        .on("mousemove", function (d) {
            tooltip.classed("hidden", false)
                .style("top", (d3.event.pageY) + "px")
                .style("left", (d3.event.pageX + 10) + "px")
                .html(d.properties.name + ': ' + d.total);

        })

        .on("mouseleave", function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .8)
            d3.select(this)
                //.transition()
                //.duration(200)
                .style("stroke", "transparent")
            tooltip.classed("hidden", true);
        })
}
