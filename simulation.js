let globalData = [];
const width = 1200;
const height = 1200;

let simulation;

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
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Look up log scale
  const scaleSize = d3.scaleLog(
    d3.extent(data, (d) => d.recordsAffected),
    [1, 20]
  );

  console.log(scaleSize(data[3].recordsAffected));

  simulation = d3
    .forceSimulation(data)
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height).strength(0.05))
    .force(
      "collide",
      d3.forceCollide((d) => Math.sqrt(1000) * 0.4 + 1)
    )
    .alphaDecay(0.01) // Reduce the alpha decay for d3 sismoother transitions
    .on("tick", ticked);

  const circles = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", (d) => Math.sqrt(scaleSize(d.recordsAffected))) // Sqrt per cerchi
    .attr("fill", (d) => colorScale(d.orgType))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  function ticked() {
    circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }
}
function groupBy(criteria) {
  let forceX, forceY;

  if (criteria === "year") {
    const yearScale = d3
      .scalePoint()
      .domain(globalData.map((d) => d.year))
      .range([100, width - 100]);

    forceX = d3.forceX((d) => yearScale(d.year)).strength(0.5);
    forceY = d3.forceY(height / 2).strength(0.01);
  } else if (criteria === "industry") {
    const industryScale = d3
      .scalePoint()
      .domain(globalData.map((d) => d.orgType))
      .range([100, width - 100]);

    forceX = d3.forceX((d) => industryScale(d.orgType)).strength(0.5);
    forceY = d3.forceY(height - 100).strength(0.01);
  } else {
    forceX = d3.forceX(width / 2).strength(0.005);
    forceY = d3.forceY(height / 2).strength(0.005);
  }

  simulation
    .force("x", forceX)
    .force("y", forceY)
    .alpha(1)
    .alphaDecay(0.01)
    .restart();
}
