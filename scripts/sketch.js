let images = [];
const numImages = 2; // Total number of images
const imgSize = 50; // Size of each image
const cols = 5; // Number of columns in the grid

function preload() {
  for (let i = 1; i <= numImages; i++) {
    let filename = nf(i, 2) + ".svg"; // Format number with leading zeros
    images.push(loadImage("assets/img/loga/" + filename));
  }
}

function setup() {
  console.log(images);
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("hero-canvas");
  background(100);
  noLoop(); // Prevent draw() from looping
}
function draw() {
  background(255);

  let x = 0;
  let y = 0;
  imageMode(CENTER);
  for (let i = 0; i < images.length; i++) {
    image(images[i], x, y, imgSize, imgSize);
    x += imgSize;
    if ((i + 1) % cols === 0) {
      x = 0;
      y += imgSize;
    }
  }
}
