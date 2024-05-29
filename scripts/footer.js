const references = [
  {
    name: "The WIRED Guide to Your Personal Data",
    url: "https://www.wired.com/story/wired-guide-personal-data-collection/",
  },
  {
    name: "WSJ – How pizza night can cost you more in data than dollars",
    url: "https://www.wsj.com/graphics/how-pizza-night-can-cost-more-in-data-than-dollars/",
  },
  {
    name: "How Much is Your Data Worth?",
    url: "https://www.invisibly.com/learn-blog/how-much-is-data-worth/",
  },
  {
    name: "IBM – What is a data breach?",
    url: "https://www.ibm.com/topics/data-breach",
  },
  {
    name: "IBM – Cost of a Data Breach Report 2023",
    url: "https://www.ibm.com/reports/data-breach",
  },
  {
    name: "Mindfulness of Your Digital Footprint",
    url: "https://medium.com/@Peter_Jarrett/mindfulness-of-your-digital-footprint-57e0cc2b83e3",
  },
  {
    name: "Ten Ways to Reduce Your Digital Footprint",
    url: "https://www.infosecurity-magazine.com/magazine-features/top-ten-reduce-digital-footprint/",
  },
];

const datasets = [
  {
    name: "Our World in Data – Internet Usage",
    url: "https://ourworldindata.org/internet",
  },
  {
    name: "UNCTAD – Data Protection and Privacy Legislation Worldwide",
    url: "https://unctad.org/page/data-protection-and-privacy-legislation-worldwide",
  },
  {
    name: "Wikipedia – List of data breaches",
    url: "https://en.wikipedia.org/wiki/List_of_data_breaches",
  },
  {
    name: "WikiDataBreachAnalysis by DavDoan",
    url: "https://github.com/DavDoan/WikiDataBreachAnalysis",
  },
  {
    name: "Kaggle – 7+ Million Company Dataset",
    url: "https://www.kaggle.com/datasets/peopledatalabssf/free-7-million-company-dataset",
  },
];

const ft_ref = document.querySelector("#ft-ref");
const ft_data = document.querySelector("#ft-data");

references.forEach((r) => {
  const ref_link = document.createElement("li");
  ref_link.innerHTML = `<a href="${r.url}"  target="_blank">${r.name}</a>`;

  ft_ref.appendChild(ref_link);
});
datasets.forEach((d) => {
  const data_link = document.createElement("li");
  data_link.innerHTML = `<a href="${d.url}" target="_blank" >${d.name}</a>`;

  ft_data.appendChild(data_link);
});
