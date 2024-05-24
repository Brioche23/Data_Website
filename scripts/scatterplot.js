let globalData = [];

let simulation;

// set the dimensions and margins of the graph
let margin = { top: 10, right: 30, bottom: 30, left: 100 },
  width = 800 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read Data
d3.csv("breaches_exp_geo.csv", (d) => {
  const parseArray = (str) => {
    // Remove single quotes and spaces, then split by comma
    return str.slice(1, -1).replace(/'/g, "").split(", ");
  };

  return {
    company: d["Company"],
    name: d["name"],
    year: +d["Year"],
    recordsAffected: +d["Number of Records Affected"],
    orgType: parseArray(d["Organization Type"]),
    breachReasons: parseArray(d["Reasons for Breach"]),
    referenceLinks: parseArray(d["Reference Link(s)"]),
    domain: d["domain"],
    yearFounded: +d["year founded"],
    industry: d["industry"],
    sizeRange: d["size range"],
    locality: d["locality"],
    country: d["country"],
    linkedinUrl: d["linkedin url"],
    currentEmployeeEstimate: +d["current employee estimate"],
    totalEmployeeEstimate: +d["total employee estimate"],
    countryCode: d["country_code"],
    latitude: +d["latitude"],
    longitude: +d["longitude"],
  };
}).then((data) => {
  globalData = data; // Store data globally
  createVisualization(data);
});

function showTooltip(event, d) {
  const tooltip = d3.select("#tooltip");
  tooltip.select("#company-name").text(d.company);
  tooltip.select("#year").text(d.year);
  tooltip.select("#records").text(d.recordsAffected);
  tooltip.select("#category").text(d.orgType);
  tooltip.select("#org-type").text(d.orgType.join(", "));
  tooltip.select("#breach-reasons").text(d.breachReasons.join(", "));

  const linksContainer = tooltip.select("#links");
  linksContainer.html(""); // Clear any existing links

  d.referenceLinks.forEach((link) => {
    linksContainer
      .append("a")
      .attr("href", link)
      .attr("target", "_blank")
      .text(link)
      .append("br");
  });
  tooltip
    .classed("hidden", false)
    .style("left", event.pageX + 5 + "px")
    .style("top", event.pageY - 28 + "px");
}

function hideTooltip() {
  d3.select("#tooltip").classed("hidden", true);
}

function createVisualization(data) {
  // Look up log scale
  const scaleSize = d3.scaleLog(
    d3.extent(data, (d) => d.recordsAffected),
    [1, 50]
  );
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Add X axis
  let x = d3.scaleLinear().domain([0, 0]).range([0, width]);
  const xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("class", "myXaxis") // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + height + ")")
    .attr("opacity", "0");

  // Add Y axis
  let y = d3.scaleLinear().domain([0, 0]).range([height, 0]);
  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(y))
    .attr("class", "myYaxis") // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + 0 + ")")
    .attr("opacity", "0");

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "dot " + d.orgType;
    })
    .attr("cx", function (d) {
      return x(d.year);
    })
    .attr("cy", function (d) {
      return y(d.recordsAffected);
    })
    .attr("r", (d) => Math.sqrt(scaleSize(d.recordsAffected))) // Sqrt per cerchi
    .attr("fill", (d) => colorScale(d.orgType))
    .style("fill", function (d) {
      return colorScale(d.orgType);
    })
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  garphStart();

  function garphStart() {
    // new X axis
    x.domain([2000, 2025]);
    svg
      .select(".myXaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisBottom(x));

    // new Y axis
    y.domain([0, 3200000000]);
    svg
      .select(".myYaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisLeft(y));

    svg
      .selectAll("circle")
      .transition()
      .delay(function (d, i) {
        return i * 3;
      })
      .duration(2000)
      .attr("cx", function (d) {
        return x(d.year);
      })
      .attr("cy", function (d) {
        return y(d.recordsAffected);
      });
  }

  //   console.log(scaleSize(data[3].recordsAffected));

  // A function that set idleTimeOut to null
  let idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // Add an event listener to the button created in the html part
  d3.select("#buttonYlim").on("input", updatePlot);
  d3.select("#sliderYlim").on("input", updatePlot);

  // A function that update the plot for a given ylim value
  function updatePlot() {
    // Get the value of the button
    ylim = this.value;

    // Update X axis
    y.domain([0, ylim * 100000000]);
    console.log(yAxis);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Update chart
    svg
      .selectAll("circle")
      .data(data)
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d.year);
      })
      .attr("cy", function (d) {
        return y(d.recordsAffected);
      });
  }
}
