let globalData = [];
let simulation;
let isClustered = true;

let vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);

// Set the dimensions and margins of the graph
let margin = { top: 50, right: 80, bottom: 100, left: 80 },
  width = 900 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

// Append the SVG object to the body of the page
let svg = d3
  .select("#scatter_cluster_chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read Data
d3.csv("data/breaches_exp_geo_macro.csv", (d) => {
  const parseArray = (str) => {
    return str.slice(1, -1).replace(/'/g, "").split(", ");
  };

  return {
    company: d["Company"],
    name: d["name"],
    year: +d["Year"],
    recordsAffected: +d["Number of Records Affected"],
    orgType: d["Organization Type"],
    macrocat: d["macrocategory"],
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
  globalData = data;
  createVisualization(data);
});

function showTooltip(event, d) {
  const tooltip = d3.select("#scatter-tooltip");
  tooltip.select("#company-name").text(d.company);
  tooltip.select("#year").text(d.year);
  tooltip.select("#records").text(d.recordsAffected);
  tooltip.select("#org-type").text(toTitleCase(d.orgType));
  tooltip.select("#country").text(toTitleCase(d.country));
  if (d.breachReasons[0] != "") {
    console.log(d.breachReasons);
    tooltip
      .select("#breach-reasons")
      .text("Breach Reasons: " + d.breachReasons.join(", "));
  }

  // const linksContainer = tooltip.select("#links");
  // linksContainer.html("");

  // d.referenceLinks.forEach((link) => {
  //   linksContainer
  //     .append("a")
  //     .attr("href", link)
  //     .attr("target", "_blank")
  //     .text(link)
  //     .append("br");
  // });
  tooltip
    .classed("hidden", false)
    .style("left", event.pageX + 5 + "px")
    .style("top", event.pageY - 28 + "px");
}

function hideTooltip() {
  d3.select("#scatter-tooltip").classed("hidden", true);
}

function createClusters(data, parameter) {
  const clusters = {};
  const clusterPadding = 10;

  // Count the number of circles in each cluster
  const parameterCounts = data.reduce((acc, d) => {
    const key = Array.isArray(d[parameter])
      ? d[parameter].join(", ")
      : d[parameter];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Get unique parameter values and sort them by counts
  const uniqueParameters = Object.keys(parameterCounts).sort(
    (a, b) => parameterCounts[b] - parameterCounts[a]
  );

  const numClusters = uniqueParameters.length;
  const clusterCols = Math.ceil(Math.sqrt(numClusters));
  const clusterRows = Math.ceil(numClusters / clusterCols);
  //   const clusterCols = 1;
  //   const clusterRows = Math.ceil(numClusters);
  const clusterWidth =
    (width - clusterPadding * (clusterCols - 1)) / clusterCols;
  const clusterHeight =
    (height - clusterPadding * (clusterRows - 1)) / clusterRows;

  uniqueParameters.forEach((param, i) => {
    const row = Math.floor(i / clusterCols);
    const col = i % clusterCols;
    clusters[param] = {
      x: col * (clusterWidth + clusterPadding) + clusterWidth / 2,
      y: row * (clusterHeight + clusterPadding) + clusterHeight / 2,
      count: parameterCounts[param],
    };
  });

  return clusters;
}

function createVisualization(data) {
  // const scaleSize = d3
  //   .scaleLog()
  //   .domain(d3.extent(data, (d) => d.recordsAffected))
  //   .range([5, 50]);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  let x = d3.scaleLinear().domain([2000, 2025]).range([0, width]);
  let y = d3.scaleLinear().domain([0, 3200000000]).range([height, 0]);

  const xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("class", "myXaxis");

  const yAxis = svg.append("g").call(d3.axisLeft(y)).attr("class", "myYaxis");

  const circles = svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    // .attr("r", (d) => Math.sqrt(scaleSize(d.recordsAffected)))
    .attr("r", "5")
    .attr("fill", (d) => colorScale(d.macrocat))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  const labels = svg.append("g").attr("class", "cluster-labels");

  const legend = svg.append("g").attr("transform", `translate(0,${height})`);

  const legendRectSize = 10;
  const legendSpacing = 6;

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.macrocat); // nest function allows to group the calculation per level of a factor

  console.log(sumstat);
  const legendItem = legend
    .selectAll(".legend-item")
    .data(sumstat)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr(
      "transform",
      (d, i) =>
        `translate(0,  ${
          margin.bottom - 20 - i * (legendRectSize + legendSpacing)
        })`
    );

  legendItem
    .append("circle")
    .attr("width", legendRectSize)
    .attr("r", legendRectSize)
    .attr("fill", (d) => colorScale(d[0]));

  legendItem
    .append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text((d) => d[0]);

  function scatterPlot() {
    d3.select("#sliderYlim").transition().duration(300).style("opacity", "1");
    x.domain([2000, 2025]);
    svg
      .select(".myXaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisBottom(x));

    y.domain([0, 3200000000]);
    svg
      .select(".myYaxis")
      .transition()
      .duration(2000)
      .attr("opacity", "1")
      .call(d3.axisLeft(y));

    circles
      .transition()
      .duration(2000)
      .attr("cx", (d) => x(d.year))
      .attr("cy", (d) => y(d.recordsAffected));

    labels.selectAll("text").remove();

    if (simulation) {
      simulation.stop();
    }
  }
  function clusterView(parameter) {
    const clusters = createClusters(data, parameter);

    svg.select(".myXaxis").attr("opacity", "0");
    svg.select(".myYaxis").attr("opacity", "0");
    d3.select("#sliderYlim").transition().duration(300).style("opacity", "0");

    if (parameter)
      labels
        .selectAll("text")
        .data(Object.keys(clusters))
        .join("text")
        .attr("x", (d) => clusters[d].x)
        .attr("y", (d) => clusters[d].y - 50)
        .attr("text-anchor", "middle")
        .attr("class", "cluster-label")
        .text((d) => `${toTitleCase(d)} (${clusters[d].count})`);

    simulation = d3
      .forceSimulation(data)
      .force(
        "x",
        d3
          .forceX(
            (d) =>
              clusters[
                Array.isArray(d[parameter])
                  ? d[parameter].join(", ")
                  : d[parameter]
              ].x
          )
          .strength(0.1)
      )
      .force(
        "y",
        d3
          .forceY(
            (d) =>
              clusters[
                Array.isArray(d[parameter])
                  ? d[parameter].join(", ")
                  : d[parameter]
              ].y
          )
          .strength(0.1)
      )
      .force(
        "collide",
        d3.forceCollide((d) => Math.sqrt(d.year) * 0.05 + 3)
      )
      .alphaDecay(0.01)
      .on("tick", ticked);

    simulation.alpha(1).restart();
  }

  function ticked() {
    circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  let currentClusterParameter = "orgType";

  d3.select("#toggleButton").on("click", function () {
    if (isClustered) {
      scatterPlot();
      d3.select("#toggleButton")
        .transition()
        .duration(500)
        .style("background-color", "black")
        .style("color", "white");
    } else {
      clusterView(currentClusterParameter);
      d3.select("#toggleButton")
        .transition()
        .duration(500)
        .style("background-color", "white")
        .style("color", "black");
    }
    isClustered = !isClustered;
  });

  d3.select("#clusterParameter").on("change", function () {
    currentClusterParameter = this.value;
    if (isClustered) {
      clusterView(currentClusterParameter);
    }
  });

  // Initial scatter plot setup
  clusterView(currentClusterParameter);

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

// Funciton to Capitalize first letters
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
