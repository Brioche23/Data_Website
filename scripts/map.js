// Load external data and boot
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv("data/Data_Protection_Privacy_Laws.csv"),
]).then(([geoData, csvData]) => {
  //   const geoData = data[0];
  //   const csvData = data[1];

  // Group CSV data by country
  const csvDataMap = new Map();
  csvData.forEach((d) => {
    if (!csvDataMap.has(d.Country)) {
      csvDataMap.set(d.Country, []);
    }
    csvDataMap.get(d.Country).push({ title: d.Title, link: d.Links });
  });

  // The svg
  const svg = d3.select("#data_map_svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Map and projection
  const projection = d3
    .geoMercator()
    .scale(100)
    .center([0, 30])
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  console.log(geoData.features);

  // List of selected countries' links
  const countryLinksContainer = d3.select("#country-links-container");

  // Draw the map
  const countries = svg
    .append("g")
    .selectAll("path")
    .data(geoData.features)
    .join("path")
    .attr("fill", (d) => {
      // Check if the country is in the CSV data
      return csvDataMap.has(d.properties.name) ? "#377eb8" : "#ccc";
    })
    .attr("class", function (d) {
      return "Country";
    })
    .attr("d", path)
    .style("stroke", "#fff")
    .on("mouseover", (event, d) => {
      console.log(d.properties.name);

      if (csvDataMap.has(d.properties.name)) {
        console.log(event);
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 0.5);

        d3.select(event.originalTarget)
          .attr("fill", "#e41a1c") // Change fill color on hover
          .style("stroke-width", "2px") // Increase stroke width on hover
          .transition()
          .duration(200)
          .style("opacity", 1);
      }
      // Retrieve additional data for the hovered country
      const countryData = csvDataMap.get(d.properties.name);
      if (countryData) {
        console.log(countryData);
      }
    })
    .on("mouseout", function (event, d) {
      const selected = d3.select(this).classed("selected");
      d3.selectAll(".Country").transition().duration(200).style("opacity", 1);
      if (csvDataMap.has(d.properties.name) && !selected) {
        d3.select(event.originalTarget)
          //   .transition()
          //   .duration(200)
          .attr("fill", (d) => {
            // Revert to original fill color
            return csvDataMap.has(d.properties.name) ? "#377eb8" : "#ccc";
          })
          .style("stroke-width", "1px"); // Revert to original stroke width
      }
    })
    .on("click", function (event, d) {
      if (csvDataMap.has(d.properties.name)) {
        const selected = d3.select(this).classed("selected");

        if (selected) {
          d3.select(this)
            .classed("selected", false)
            .attr("fill", (d) => {
              // Revert to original fill color
              return csvDataMap.has(d.properties.name) ? "#377eb8" : "#ccc";
            })
            .style("stroke-width", "1px"); // Revert to original stroke width

          // Remove country links container
          d3.select(`#country-links-${d.properties.name}`).remove();
        } else {
          d3.select(this)
            .classed("selected", true)
            .attr("fill", "#e41a1c") // Change fill color to indicate selection
            .style("stroke-width", "2px"); // Increase stroke width to indicate selection

          // Create country links container
          const countryLinksList = countryLinksContainer
            .insert("ul", ":first-child")
            .attr("data-country", d.properties.name)
            .attr("id", `country-links-${d.properties.name}`)
            .attr("class", "country-links");
          // Add country links to the list
          const countryData = csvDataMap.get(d.properties.name);
          if (countryData) {
            countryLinksList.append("h3").html(`${d.properties.name}`);
            countryData.forEach((linkObj) => {
              countryLinksList
                .append("li")
                .html(
                  `<a href="${linkObj.link}" target="_blank">${linkObj.title}</a>`
                );
            });
          }
        }
      }
    });
});
