// let count_values = [{ value: 0, label:"" }, 165, 4450000, 120000];
let count_values = [
  { value: 0, label: "" },
  { value: 165, label: "$" },
  { value: 4450000, label: "$" },
  { value: 120000, label: " rec." },
];

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const obj = document.getElementById("counter");
const c_label = document.getElementById("counter-label");
// animateValue(obj, 100, 0, 1000);

let prevIndex;

document.addEventListener("scroll", function () {
  let counter_paragraphs = document.querySelectorAll(".counter-text");

  counter_paragraphs.forEach((p) => {
    let bcr = p.getBoundingClientRect();
    let isNotHiddenBelow = bcr.y < window.innerHeight - window.innerHeight / 4;
    let isNotHiddenAbove = bcr.y > 0;
    // console.log(p.id, isNotHiddenBelow, isNotHiddenAbove);

    if (isNotHiddenAbove && isNotHiddenBelow) {
      // console.log(p.id + "my element is visible now");
      // triggerInput.value = parseInt(p.dataset.value);
      // console.log(p.dataset.value);
      // p_state_text.innerHTML = p.id;

      if (p.dataset.index) {
        const newIndex = parseInt(p.dataset.index);
        console.log(newIndex);
        if (newIndex !== prevIndex) {
          prevIndex = newIndex;
          console.log(prevIndex);
          animateValue(
            obj,
            count_values[newIndex].value,
            count_values[newIndex + 1].value,
            1000
          );
          c_label.innerHTML = count_values[newIndex + 1].label;
        }
      }
    }
  });

  // let sections = document.querySelectorAll("section");
  let black = false;
  let body = document.querySelector("body");
  sections.forEach((s) => {
    let s_bcr = s.getBoundingClientRect();
    let isNotHiddenBelow =
      s_bcr.y < window.innerHeight - window.innerHeight / 4;
    let isNotHiddenAbove = s_bcr.y > 0;
    // console.log(p.id, isNotHiddenBelow, isNotHiddenAbove);

    if (isNotHiddenAbove && isNotHiddenBelow) {
      // console.log(p.id + "my element is visible now");
      // triggerInput.value = parseInt(p.dataset.value);
      // console.log(p.dataset.value);
      // p_state_text.innerHTML = p.id;
      console.log(s.dataset.title);
      // if (s.dataset.title == "Conclusion" && !black) {
      //   body.style.backgroundColor = "black";
      //   body.style.color = "white";
      //   black = true;
      // }
      // if (black && s.dataset.title == "Data Breaches") {
      //   body.style.backgroundColor = "white";
      //   body.style.color = "black";
      //   black = false;
      // }
    }
  });

  //   // if(bcr.y < window.innerHeight && bcr.y > 0 ){
  //   //     console.log("it's visible!!")
  //   // }
});

let sections = document.querySelectorAll("section");
let nav = document.querySelector("#navbar");
console.log(nav);
sections.forEach((s) => {
  if (s.dataset.emoji) {
    console.log(s);
    const nav_el = document.createElement("li");
    nav_el.innerHTML = `<a href="#${s.id}" >
    <span class="nav-title"> ${s.dataset.title}</span>
    <span class="nav-emoji"> ${s.dataset.emoji}</span>
   </a>`;
    nav.appendChild(nav_el);
  }
});
