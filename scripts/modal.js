let modal_wrapper = document.querySelector("#modal-wrapper");
let body = document.querySelector("body");

const hideModal = () => {
  modal_wrapper.style.display = "none";
  body.style.overflow = "auto";
  body.style.overflowX = "hidden";
};
