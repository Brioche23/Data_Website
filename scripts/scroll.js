let p_state = 0;
let p_state_text = document.querySelector("#p-state");

let currentPhase;

// let triggerInput;

// const r = new rive.Rive({
//   src: "assets/rive/pizza.riv",
//   canvas: document.getElementById("canvas"),
//   autoplay: true,
//   stateMachines: "Progression",
//   onLoad: () => {
//     r.resizeDrawingSurfaceToCanvas();
//     // Get the inputs via the name of the state machine
//     const inputs = r.stateMachineInputs("Progression");

//     triggerInput = inputs[0];
//     triggerInput.value = 0;
//     console.log(inputs);
//   },
// });

// Load and parse the CSV data
let added_rows = 0;
let printed_paragraphs = 0;
d3.csv("data/data_story.csv").then((data) => {
  data.forEach((d, i) => {
    d.index = i; // add an index for easy reference
  });

  // Function to draw circles for each company
  let draw_all = false;
  const drawCompanyCircles = (companies, phaseIndex) => {
    console.log("Draw circles at " + phaseIndex);
    if (phaseIndex >= companies.length) return;
    const rowHeight = 40;
    const colWidth = 30;
    const maxPerRow = 8;

    const companyData = companies[phaseIndex];
    // const [company, records] = companyData;

    let record_in_piu = 0;
    companies.forEach((companyData, companyIndex) => {
      if (phaseIndex === companyIndex && !draw_all) {
        const [content, records] = companyData;

        records.forEach((d, i) => {
          // const row = Math.floor(i / maxPerRow);
          const col = (i % maxPerRow) + 1;
          let row = companyIndex + added_rows;

          // How many rows i need to display all the circles of this company with the fixed number per row
          let excess = Math.ceil(records.length / maxPerRow);

          /*
          I the excess is greater than 1 then I will need to add more rows, so the previous statement that
          index = row is not true.
          I have to keep track of how many rows I add with the variable added_rows, that need to be visible globally and not refreshed.
          The variable should be incremented everytime the number of records added exceeds the number of maxPerRow
          */
          record_in_piu++;
          if (excess > 1) {
            if (record_in_piu % maxPerRow == 0 || record_in_piu == 0)
              added_rows++;
          }

          if (i == 1) {
            console.log("excess: " + excess);
            console.log(d.company + " : " + companyIndex);
            console.log("excess: " + excess);
            console.log("CIndex: " + companyIndex);
            console.log("RAggiunte: " + added_rows);
            console.log("Col: " + col);
            console.log("Row: " + row);
            console.log("Cy: " + row * rowHeight);
          }

          // Temporary solution to stop the animation at the end
          if (companyIndex == 5) {
            console.log("End loop!");
            draw_all = true;
            //! At 6 trigger rearrangement
          }
          // if (printed_paragraphs == 6) {
          //   console.log("End loop!");
          //   draw_all = true;
          //   //! At 6 trigger rearrangement
          // }

          let circles = svg
            .data(data)
            .append("circle")
            .attr("cx", col * colWidth)
            .attr("cy", row * rowHeight)
            .attr("r", 10)
            .attr("class", d.type)
            .attr("opacity", 0);

          circles
            .transition()
            .duration(500)
            .delay(i * 100)
            .attr("opacity", 1);

          circles
            .on("mouseover", (e) => showPizzaTooltip(e, d))
            .on("mouseout", hidePizzaTooltip);
        });
      }
    });
  };

  document.addEventListener("scroll", function () {
    let pizza_paragraphs = document.querySelectorAll(".pizza-text");

    pizza_paragraphs.forEach((p) => {
      let bcr = p.getBoundingClientRect();
      let isNotHiddenBelow =
        bcr.y < window.innerHeight - window.innerHeight / 4;
      let isNotHiddenAbove = bcr.y > 0;
      // console.log(p.id, isNotHiddenBelow, isNotHiddenAbove);

      if (isNotHiddenAbove && isNotHiddenBelow) {
        // console.log(p.id + "my element is visible now");
        // triggerInput.value = parseInt(p.dataset.value);
        // console.log(p.dataset.value);
        // p_state_text.innerHTML = p.id;

        const newPhase = parseInt(p.dataset.value);
        if (newPhase !== currentPhase) {
          currentPhase = newPhase;
          console.log(currentPhase);
          printed_paragraphs++;
          drawCompanyCircles(companies, currentPhase);
        }
      }
    });

    //   // if(bcr.y < window.innerHeight && bcr.y > 0 ){
    //   //     console.log("it's visible!!")
    //   // }
  });

  console.log(data);
  // Set up the SVG canvas dimensions
  const margin = { top: 100, right: 10, bottom: 10, left: 10 };
  const width = 300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const svg = d3
    .select("#pizza-phases")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Group data by company
  const companies = d3.groups(data, (d) => d.company);

  const labels = svg.append("g").attr("class", "cluster-labels");

  const legend = svg.append("g").attr("transform", `translate(30,-40)`);
  const legendRectSize = 5;
  const legendSpacing = 10;

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.type); // nest function allows to group the calculation per level of a factor

  console.log(data);
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
    .attr("class", (d) => d[0]);
  // .attr("fill", (d) => colorScale(d[0]));

  function typeName(name) {
    if (name === "additional") return "Company-collected";
    else return "User-given";
  }
  legendItem
    .append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - 2)
    .text((d) => typeName(d[0]));

  // Draw circles for each company
  // drawCompanyCircles(companies, 0);
});

function showPizzaTooltip(event, d) {
  console.log("Tooltip!");

  const tooltip = d3.select("#pizza-tooltip");
  tooltip.select("#company-pizza-name").text(toTitleCase(d.company));
  tooltip.select("#pizza-content").text(d.content);

  let section = document.querySelector("#pizza").getBoundingClientRect();

  // console.log(section);

  tooltip
    .classed("hidden", false)
    .style("left", event.pageX - section.left + 5 + "px")
    .style("top", event.pageY - 28 + "px");
}

function hidePizzaTooltip() {
  d3.select("#pizza-tooltip").classed("hidden", true);
}
