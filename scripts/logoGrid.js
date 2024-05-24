document.addEventListener("DOMContentLoaded", () => {
  const imageGrid = document.getElementById("hero-grid");
  const numImages = 100; // Total number of images
  const imagePath = "assets/img/loga/"; // Adjust the path to your folder
  const imgHeight = 50;

  for (let i = 1; i <= numImages; i++) {
    const img = document.createElement("img");
    const filename = imagePath + (i < 10 ? "0" + i : i) + ".svg"; // Format number with leading zero if less than 10
    img.src = filename;
    img.height = imgHeight;
    img.alt = `Image ${i}`;
    imageGrid.appendChild(img);
  }
});
