function drawChart1() {
    var yearSelector = document.getElementById('yearSelector');

    var url = 'https://raw.githubusercontent.com/ChengruiWU990531/fit5145_data/main/Question1.csv';

    var margin = { top: 20, right: 100, bottom: 50, left: 100 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var yAxisDomain = [0, 0];
    var xAxisDomain = [];
    var xAxisRange = [0, width];
    var yAxisRange = [height, 0];

    // append the svg object to the body of the page
    d3.select("#Question1").selectAll("*").remove();
    var svg = d3.select("#Question1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Parse the Data
    d3.csv(url, function (csvData) {
        var columns = csvData.columns;
        var allGroup = [columns[1], columns[2]];
        let xLabel = columns[0];

        var movieData = {};
        var tvShowData = {};
        csvData.forEach(row => {
            let rowMouth = row[xLabel].split("-");
            let year = parseInt(rowMouth[0]);
            let mouth = parseInt(rowMouth[1]);
            let movieValue = parseInt(row[columns[1]]);
            let tvShowValue = parseInt(row[columns[2]]);
            if (yearSelector.value == 'All') {
                if (!movieData.hasOwnProperty(year)) {
                    let movie = {};
                    movie[xLabel] = year;
                    movie['value'] = 0;
                    movieData[year] = movie;

                    let tvShow = {};
                    tvShow[xLabel] = year;
                    tvShow['value'] = 0;
                    tvShowData[year] = tvShow;
                }

                movieData[year]['value'] += movieValue;
                tvShowData[year]['value'] += tvShowValue;
            } else if (year === parseInt(yearSelector.value)) {
                let movie = {};
                movie[xLabel] = mouth;
                movie['value'] = movieValue;
                movieData[mouth] = movie;

                let tvShow = {};
                tvShow[xLabel] = mouth;
                tvShow['value'] = tvShowValue;
                tvShowData[mouth] = tvShow;
            }
        })

        var data = [{ name: columns[1], values: [] }, { name: columns[2], values: [] }];
        for (const [key, value] of Object.entries(movieData)) {
            if (xAxisDomain.length === 0) {
                xAxisDomain.push(key);
                xAxisDomain.push(key);
            }
            xAxisDomain[1] = Math.max(xAxisDomain[1], key);

            yAxisDomain[1] = Math.max(yAxisDomain[1], value['value']);
            data[0].values.push(value);
        }
        for (const [key, value] of Object.entries(tvShowData)) {
            yAxisDomain[1] = Math.max(yAxisDomain[1], value['value']);
            data[1].values.push(value);
        }
        yAxisDomain[1] += 20;

        var myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);

        // X axis
        var x = d3.scaleLinear()
            .domain(xAxisDomain)
            .range(xAxisRange)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text(function (d) {
                if (yearSelector.value == 'All') {
                    return "Year";
                } else {
                    return "Month";
                }
            });


        // Add Y axis
        var y = d3.scaleLinear()
            .domain(yAxisDomain)
            .range(yAxisRange);
        svg.append("g")
            .call(d3.axisLeft(y));
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 30 - margin.left)
            .attr("x", 20 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of added contents");

        // Add the lines
        var line = d3.line()
            .x(function (d) {
                return x(+d[xLabel])
            })
            .y(function (d) {
                return y(+d.value)
            })
        svg.selectAll("myLines")
            .data(data)
            .enter()
            .append("path")
            .transition()
            .duration(1500)
            .attr("class", function (d) {
                return d.name
            })
            .attr("d", function (d) {
                return line(d.values)
            })
            .attr("stroke", function (d) {
                return myColor(d.name)
            })
            .style("stroke-width", 4)
            .style("fill", "none")

        // Add the points
        svg
            // First we need to enter in a group
            .selectAll("myDots")
            .data(data)
            .enter()
            .append('g')
            .style("fill", function (d) {
                return myColor(d.name)
            })
            .attr("class", function (d) {
                return d.name
            })
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(function (d) {
                return d.values
            })
            .enter()
            .append("circle")
            .transition()
            .duration(800)
            .attr("cx", function (d) {
                return x(d[xLabel])
            })
            .attr("cy", function (d) {
                return y(d.value)
            })
            .attr("r", 5)
            .attr("stroke", "white")
            .text(function (d) {
                return d['value']
            })

        // add text
        svg
            // First we need to enter in a group
            .selectAll("myDots")
            .data(data)
            .enter()
            .selectAll("myPoints")
            .data(function (d) {
                return d.values
            })
            .enter()
            .append("text")
            .classed('data', true)
            .attr("y", function (d) {
                return y(d['value']) - 10;
            })
            .attr("x", function (d) {
                return x(d[xLabel]) - 5;
            })
            .attr("font-size", '10px')
            .attr("color", function (d) {
                return myColor(d.name)
            })
            .text(function (d) {
                return d['value']
            })


        // Add a label at the end of each line
        svg
            .selectAll("myLabels")
            .data(data)
            .enter()
            .append('g')
            .append("text")
            .attr("class", function (d) {
                return d.name
            })
            .datum(function (d) {
                return { name: d.name, value: d.values[d.values.length - 1] };
            }) // keep only the last value of each time series
            .attr("transform", function (d) {
                return "translate(" + x(d.value[xLabel]) + "," + y(d.value.value) + ")";
            }) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(function (d) {
                return d.name;
            })
            .style("fill", function (d) {
                return myColor(d.name)
            })
            .style("font-size", 15)
    })
}

function init() {
    drawChart1();
}

init()