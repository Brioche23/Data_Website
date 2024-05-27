let count_values = [0, 165, 4450000, 120000];

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
            count_values[newIndex],
            count_values[newIndex + 1],
            1000
          );
        }
      }
    }
  });

  //   // if(bcr.y < window.innerHeight && bcr.y > 0 ){
  //   //     console.log("it's visible!!")
  //   // }
});
