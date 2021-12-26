var CrossesOut = document.querySelector('.data.cross');
var DropsOut = document.querySelector('.data.drop');
var ExpOut = document.querySelector('.data.exp');
var TheorOut = document.querySelector('.data.theor');
var DiffOut = document.querySelector('.data.diff');

var grid = document.getElementById('grid');

var slider = document.getElementById("length");
var RatioOut = document.getElementById("ratioDisplay");
RatioOut.innerHTML = slider.value; // Display the default slider value
var length;

var crosses;
var drops;
var experimental;
var theoretical;
var rst = false;  //determine if need to reset when drop() is called

var colorIndex = 0; //keeps track of which color to use

reset();

function reset() {
  document.querySelectorAll('.needle').forEach(needle => {
    needle.remove();
  });
  length = slider.value * 100;

  if (slider.value <= 1)
    theoretical = 2 / Math.PI * slider.value;
  else {
    let WtoL = 1 / slider.value;
    theoretical = 2 / Math.PI * slider.value * (WtoL * Math.acos(WtoL) - Math.sqrt(1 - WtoL * WtoL) + 1);
  }
  TheorOut.innerHTML = theoretical.toFixed(10);

  DiffOut.innerHTML = "-";
  ExpOut.innerHTML = "-";

  drops = 0;
  crosses = 0;
  DropsOut.innerHTML = drops;
  CrossesOut.innerHTML = crosses;

  rst = false;
}

function drop(amt) {
  if(rst)
    reset();
  for (let i = 0; i < amt; i++) {
    //create random position and rotation of needle
    let x = Math.floor(Math.random() * 501) + 50;
    let y = Math.floor(Math.random() * 351) + 25;
    let theta = Math.random() * Math.PI; //angle between 0 and pi

    //adding needle to DOM
    let needle = document.createElement('div');
    needle.className = 'needle';
    needle.style.width = `${length}px`;
    needle.style.transform = `rotate(${theta}rad)`;

    //convert theta to only deal with acute angles
    if (theta > Math.PI / 2)
      theta = Math.PI - theta;

    //divs are positioned from the top, correcting x so it references the center
    needle.style.left = `${x - length / 2}px`;
    needle.style.top = `${y}px`;
    needle.style.backgroundColor = `${color()}`;
    grid.appendChild(needle);

    if (checkCross(x, theta))
      crosses++;
  }
  CrossesOut.innerHTML = crosses;

  drops += amt;
  DropsOut.innerHTML = drops;

  experimental = crosses / drops;
  ExpOut.innerHTML = experimental.toFixed(10);

  DiffOut.innerHTML = (Math.abs(experimental - theoretical) / theoretical * 100).toFixed(10);
}

function checkCross(x, theta) {
  let distance; //distance to closest line
  distance = (x % 100 < 50) ? x % 100 : 100 - x % 100;

  //convert theta so only dealing with quadrant 1
  //this is possible because a theta of 170 is treated the same as a theta of 10
  //the only difference is whether the "head" or "tail" of the needle crosses

  if (distance >= length / 2)
    return false;
  return theta < Math.acos(2 * distance / length);
}

// Update the current slider value
slider.oninput = function () {
  RatioOut.innerHTML = this.value;
  rst = true;
}

//generates a color using HSL
function color() {
  let NUM_COLORS = 9;
  let color = 360 / NUM_COLORS;

  colorIndex = (colorIndex === 8) ? 0 : colorIndex + 1; //increments until 8, then resets to 0
  let h = colorIndex * color;
  let s = (h>= 55 && h <= 95) ? 85 : 100;
  
  return `hsl(${h}, ${s}%, 50%)`;
}