// Read Data
d3.csv("data/Internet_users.csv", (d) => {
  // Process the data to filter out continents
  return {
    entity: d["Entity"],
    code: d["Code"],
    year: +d["Year"],
    nUsers: +d["Number of Internet users"],
  };
}).then((data) => {
  // Stack the data: each group will be represented on top of each other
  const continents = [
    "Europe",
    "Asia",
    "Africa",
    "North America",
    "South America",
    "Oceania",
    "Antarctica",
  ];

  //   const continents = ["Africa", "Europe"];
  const continentData = data.filter((d) => continents.includes(d.entity)); // Assuming the 'country' field holds the continent names

  // Now you can use continentData for your visualizations
  console.log(continentData);
  createLineChart(continentData);
});

// Now I can use this dataset:
function createLineChart(data) {
  // set the dimensions and margins of the graph
  const margin = { top: 50, right: 100, bottom: 50, left: 80 },
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#line_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.entity); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function (d) {
        return d.year;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.nUsers;
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));
  // color palette
  const color = d3
    .scaleOrdinal()
    .range([
      "#e41a1c",
      "#377eb8",
      "#4daf4a",
      "#984ea3",
      "#ff7f00",
      "#ffff33",
      "#a65628",
      "#f781bf",
      "#999999",
    ]);

  // Draw the line
  svg
    .selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(d[0]);
    })
    .attr("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(+d.nUsers);
        })(d[1]);
    });

  svg
    .selectAll("mydots")
    .data(sumstat)
    .enter()
    .append("circle")
    .attr("cx", 100)
    .attr("cy", function (d, i) {
      return 100 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return color(d[0]);
    });

  svg
    .selectAll("mylabels")
    .data(sumstat)
    .enter()
    .append("text")
    .attr("x", 120)
    .attr("y", function (d, i) {
      return 100 + i * 27;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "black")
    .text(function (d) {
      console.log(d);
      return d[0];
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
