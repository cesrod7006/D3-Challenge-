// @TODO: YOUR CODE HERE!
// wrap code inside a function that automatically resizes the chart 
function makeResponsive() {

    // If the SVG Area is not empty when the browser loads, remove and replace with a resized version of the chart 
    var svgArea = d3.select("body").select("svg");

    // clear SVG area if not empty 
    if (!svgArea.empty()) {
        svgArea.remove();
      }

    // Setup Chart Parameters/Dimensions
  var svgWidth = 980;
  var svgHeight = 600;

  // Set SVG Margins
  var margin = {
    top: 20,
    right: 40,
    bottom: 90,
    left: 100
  };

  // Define Dimensions of the Chart Area
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG Element/Wrapper - Select Body, Append SVG Area & Set the Dimensions
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


        // read csv
        d3.csv("assets/data/data.csv").then(function(healthData) {
        healthData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.smokes = +data.smokes;
        });

        // create scales 
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(healthData, data => data.poverty))
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthData, data => data.smokes)])
            .range([height, 0]);

        // create axis
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);

        // append Axes
        chartGroup.append ("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        chartGroup.append("g")
        .call(yAxis);

        chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2) )
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Median Age of Smokers");

        chartGroup
            .append("text")
            .attr("transform", `translate(${width/2}, ${height + margin.top +20})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");

        // create circles
        var circleGroup = chartGroup.selectAll("stateCircle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", data => xLinearScale(data.poverty))
        .attr("cy", data => yLinearScale(data.smokes))
        .attr("class", "stateCircle")
        .attr("r", "20")
        .attr("opacity", "0.75")
        

        // Append Text to Circles
        var textGroup = chartGroup.selectAll("stateText")
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", data => xLinearScale(data.poverty))
        .attr("y", data => yLinearScale(data.smokes))
        .text(d => (d.abbr))
        .attr("class", "stateText")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

        // initialize toolTip
        var toolTip = d3
        .tip()
        .attr("class", "toolTip")
        .offset([80,-60])
        .html(function(data){
            var stateName = data.state;
            var pov = +data.poverty;
            var smoke = +data.smokes;
            return(stateName + "<br> Poverty(%): " + pov + "<br> Smoker Age (Median) " + smoke
            );
        });
            // create the toolTip in chart group

            circleGroup.call(toolTip)

        // create event listners
        circleGroup.on("mouseover", function(data){
            toolTip.show(data,this);
        })
            .on("mouseout", function(data,index){
                toolTip.hide(data,this);
            })

    }).catch(function(error) {
        console.log(error);
      });

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);