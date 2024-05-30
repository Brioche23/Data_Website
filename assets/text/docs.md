A way more readable version of this page can be found in [this Notion](https://www.notion.so/Project-Report-60c44936a5c84a55a83c00da6e8b518f?pvs=21).

# Intro

### Abstract

Will there be blood? 🩸

Just like oil used to fuel machines, power industries, and enrich the few by exploiting the resources of the many, Data today is what makes big companies go. They (the companies) harvest those data from us daily, and we are constantly providing them on a silver platter, by merely using the very same instruments that they themselves offer us in exchange: video calls, posts on social networks, voice assistants, and now AI.

This website aims to analyze the relationship between the User, the Company, and the Data from different points of view and at different scales: from the most innocent Alexa request to the biggest and most disruptive data breach. All this while attempting to provide some tools for living, or at least surviving, in the digital world.

So (getting back at the oil metaphor), while Paul Thomas Anderson, when dealing with the greed and selfishness of humans, promises us that, yes, There Will Be Blood, in our virtual world the answer is less obvious. We just have to wait and see, always wondering: Will there be blood?

## Topic

Showing the process through which, as users, we give away our data to big companies and organizations, what and how much they collect, and visualizing a history of how those data got stolen from those companies and for what reason. Critically reflecting on our relationship with companies and organizations, when dealing with data, while also providing some historical and functional information about the correct usage of online data.

### Questions

- How do big companies get data from us?
- Are we aware of the data that we share with big companies?
- How are personal data and privacy regulated? And by whom?
- What’s the value of these data, both for companies and us?
- Can we learn something by visualizing the major data breaches of the past twenty years?

## Why is it relevant?

The topic of personal data, privacy, and consent is by now fully embedded in how society works and has a big, but silent, impact on our everyday life, that is not taking place just in the tangible world, but in the digital one as well.

Providing an overview of the theme by visualizing different aspects of it, seems a good way to provide some critical and practical knowledge, without having the arrogance to instill some behavioral change in the readers. The website places itself as a potential starting point for deeper research and understanding of this wide topic.

## Personas

In order to better understand the ultimate goals of this project I’ve quickly come up with two potential users that could be interested in using this website to acquire more practical and critical knowledge.

### Carlo

He is a high school student, a very frequent social media user, and has good digital skills, but he has no idea of the actual amount of data given to companies in his daily Internet usage, and what all of this implies.

He is tasked to do some research about the topic, and thanks to the website he can easily understand this process of data exchange and apply it to his situation

### Giovanna

She is a 35-year-old public administration worker, she needs more information about how data on the web are exchanged and what are the potential risks of dealing with online data.

She can use the websites to quickly gather a critical understanding of data sharing online, **quickly examine some policies (eg EU’s GDPR or other national policies) with quick links to the official sources,** explore historical records of data breaches, filter the breaches for "government only" and see what are the most probable causes of a Data Breach.

This second persona actually gave me the idea of including a world map of Data Privacy Legislation, with direct access to the official documentation.

# Execution

## Structure and Visualizations

| Section         | Description                                                                                                                                      | Visualization / Chart     | Data Source                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | ---------------------------- |
| Introduction    | How Internet usage worldwide has changed in the past decades                                                                                     | Line chart                | Data World                   |
| Data Story      | The scrolling section reveals the potential amount of information we give away while performing a simple activity, such as a pizza & movie night | Info dots with tooltips   | Wall Street Journal          |
| Legislation Map | Visualizing which countries currently have a law dealing with data protection and have direct access to these laws                               | Choropleth map            | UN Datasets                  |
| Data Breaches   | Visualizing the most important data breaches of the past two decades                                                                             | Clusters and Scatter plot | Wikipedia Data Breaches List |
| Conclusion      | Ending with a reflection on the real economic value of the data we provide and giving some tooltips to reduce one’s digital footprint            | —-                        | IBM Data Breach Report 2023  |

### Data Wrangling with Python

For the realization of this website I’ve used multiple datasets, some of them were already cleaned and ready to be used (Internet Usage and Worldwide Legislation), and others I had to completely build them myself (Data Story about the Pizza Night).

But the one data frame that underwent the most elaboration was definitely the Data Breaches one. Let’s take a look at how I processed and cleaned it using Python and Pandas.

I started with **data_breches.csv**, an already cleaned-up file that gathers 347 big data breaches from the Wikipedia page.

I wanted to add more information to the records, so I found this huge dataset of more than 7 million companies, but the titles didn’t match. So I’ve manually added a company_name column to the breaches, matching exactly the name of the company. Then I merged them.

The code can be found in the project’s GitHub, along with other Python experiments, such as the failed attempt at creating a Data scraping script for automatically downloading every company’s logo in .svg.

![Fig. 01 - Data processing](/assets/img/about/about_01.png)

Fig. 01 - Data processing

## Layout & Appearance

From the start I wanted it to be a fairly clean website, easy to read, and with a bigger graphical focus on the charts. My main reference for this project was some scrolly-telling experiences made by [The Pudding](https://pudding.cool/) (especially this one about visualizing [Hamilton’s lyrics](https://pudding.cool/2017/03/hamilton/)).

So, after gathering the content I created a quick [prototype on Figma](https://www.figma.com/proto/ZyIp5lajpyYasw2I6Jlgnl/ID-%7C-Assigments?page-id=200%3A6&node-id=324-59&viewport=-2233%2C441%2C0.2&t=96LYCcciAyQRdOXj-1&scaling=min-zoom&starting-point-node-id=477%3A130) to see how it all played out.

## Website development

The website itself is just the classic combination of HTML, CSS, and JavaScript, so I will not go in-depth into the making of that part (And the [probably a bit messy] code is available on [GitHub](https://github.com/Brioche23/Data_Website) anyway).

What I will more extensively explain is the making of some of the charts, made using d3.js, a library that I knew nothing about at the beginning of the project, and that I successfully used thanks to the Documentation, the help of Nicola Cerioli and (without shame whatsoever) an additional hand from ChatGPT.

### Info dots with tooltips

The hardest part of the Pizza story section was to make the dots appear when scrolling.

I did so by tracking the paragraphs with an “onScroll” listener

```jsx
  document.addEventListener("scroll", function () {
    let pizza_paragraphs = document.querySelectorAll(".pizza-text");

    pizza_paragraphs.forEach((p) => {
      let bcr = p.getBoundingClientRect();
      let isNotHiddenBelow =
        bcr.y < window.innerHeight - window.innerHeight / 4;
      let isNotHiddenAbove = bcr.y > 0;

      if (isNotHiddenAbove && isNotHiddenBelow) {

        const newPhase = parseInt(p.dataset.value);
        if (newPhase !== currentPhase) {
          currentPhase = newPhase;
          printed_paragraphs++;
          drawCompanyCircles(companies, currentPhase);
        }
      }
    });
```

and then iterating each company to print the dots, with a transition and delay property to create the fade-in.

### Choropleth map

The Map makes use of two different datasets, one that creates the polygons for each country and another one that actually provides the information about the legislation.

```jsx
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv("data/Data_Protection_Privacy_Laws.csv"),
]).then(([geoData, csvData]) => {
```

All the polygons are drawn on a projection map and colored based on their presence in the legislation dataset.

```jsx
// Map and projection
const projection = d3
  .geoMercator()
  .scale(100)
  .center([0, 30])
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const countries = svg
  .append("g")
  .selectAll("path")
  .data(geoData.features)
  .join("path")
  .attr("fill", (d) => {
    // Check if the country is in the CSV data
    return csvDataMap.has(d.properties.name) ? "#69b3a2" : "#ccc";
  });
```

Those same polygons are then used to trigger and clicking function that adds the respective legislation links to the nearby container.

### Data Breach Clusters

The last and most complicated visualization is the clusterization of data breaches, which can be rearranged dynamically based on different parameters [Fig. 02] and also transformed into a static scatterplot [Fig. 03] to also have a temporal and quantitative perspective on the data breach phenomena.

Hovering on the dots, a popup window will appear next to the mouse cursor, giving additional information about the selected breach.

![Fig. 02 – Cluster of Data Breaches and Controls](/assets/img/about/about_02.png)

Fig. 02 – Cluster of Data Breaches and Controls

![Fig. 03 – Scatterplot](/assets/img/about/about_03.png)
Fig. 03 – Scatterplot

Each dot is a data breach, while the color scale is based on eight macro-categories that include all the companies’ organization types.

They serve the purpose of showing quantitatively the wide collection of data breaches that have happened in the last twenty years. The data are collected from [the Wikipedia page about Data Breaches](https://en.wikipedia.org/wiki/List_of_data_breaches). The target of this visualization is either people looking for information about the use and misuse of data online or, most likely, workers and security specialists in the public and private sectors, who want to have an overview of when, how, and why similar companies have been victims of a breach.

A key effect that I wanted to achieve was to make the dots move dynamically when rearranging them in different clusters. To do so, in D3 I use a combination of transition and simulation.

In a nutshell, when the clusterization is active, the dots are arranged through a forceSimulation, that pulls dots of the same group together and repels the others.

```jsx
simulation = d3
  .forceSimulation(data)
  .force(
    "x",
    d3
      .forceX(
        (d) =>
          clusters[
            Array.isArray(d[parameter]) ? d[parameter].join(", ") : d[parameter]
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
            Array.isArray(d[parameter]) ? d[parameter].join(", ") : d[parameter]
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
```

When switching to the scatterplot, the simulation is turned off and the dots, with a transition, are magically moved to the right place.

```jsx
function scatterPlot() {
  d3.select("#range-wrapper").transition().duration(300).style("opacity", "1");
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
  labels.selectAll("rect").remove();

  if (simulation) {
    simulation.stop();
  }
}
```

When in scatterPlot mode the dots are arranged by year on the x-axis, and by quantity of records stolen on the y-axis. Since the number of records changes drastically (from 100.000 to 3.000.000.000), it is also possible to zoom in on the lower part of the plot thanks to a slider.

```jsx
// A function that update the plot for a given ylim value
function updatePlot() {
  // Get the value of the slider
  ylim = this.value;

  // Update Y axis
  y.domain([0, ylim * 100000000]);
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
```

# Conclusion

This project barely scratches the surface in terms of quantity and quality of information presented, focusing on horizontally explaining different points of view on the subject of Data Privacy and Big Companies Involvement. For each topic presented here (Internet Usage, Data, small actions, Worldwide legislation, Data Breaches, and Digital Footprints) it is possible to dig deeper and produce more exhaustive outputs that vertically explore their potentialities. And I hope to work on it in the future, or that someone, after this quick read, feels inspired to do the same.

One big theme that is missing from this website is the relatively newborn and ever-so-scary rise of Artificial Intelligence tools, and how they gather and process data from us by direct interaction.

The goal of this project was to be a starting point to approach this wide topic, pointing the finger towards a series of different directions, that are ready to be explored.
