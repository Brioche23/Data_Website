let p_state = 0;
let p_state_text = document.querySelector("#p-state");
document.addEventListener("scroll", function () {
  let pizza_paragraphs = document.querySelectorAll(".pizza-text");

  pizza_paragraphs.forEach((p) => {
    let bcr = p.getBoundingClientRect();
    let isNotHiddenBelow = bcr.y < window.innerHeight - window.innerHeight / 8;
    let isNotHiddenAbove = bcr.y > 0;
    console.log(p.id, isNotHiddenBelow, isNotHiddenAbove);

    if (isNotHiddenAbove && isNotHiddenBelow) {
      console.log(p.id + "my element is visible now");
      p_state_text.innerHTML = p.id;
    }
  });

  // if(bcr.y < window.innerHeight && bcr.y > 0 ){
  //     console.log("it's visible!!")
  // }
});
