let SIZE = 1000;
let OBJECTS = [];
let SPEED = 0.005;

function main() {
  let canvas = document.getElementById('myCanvas');
  let ctx = canvas.getContext('2d');

  canvas.width = SIZE;
  canvas.height = SIZE;
  ctx.scale(SIZE, SIZE);

  let props = {
    levels: 4,
    wallColour: 'brown',
    roofColour: randomColour(),
    door: Math.random() < 0.5 ? true : false,
  };
  OBJECTS.push(new House([0.25, 0.52], 0.18, props));
  props = {
    levels: 4,
    wallColour: 'brown',
    roofColour: randomColour(),
    door: true,
  };
  OBJECTS.push(new House([0.8, 0.6], 0.25, props));
  props = {
    levels: 5,
    wallColour: 'brown',
    roofColour: randomColour(),
    door: false,
  };
  OBJECTS.push(new House([0.65, 0.7], 0.3, props));
  props = {
    levels: 6,
    wallColour: 'brown',
    roofColour: 'darkred',
    door: true,
  };
  OBJECTS.push(new House([0.4, 0.8], 0.4, props));

  drawScene();
  animate();
}

//ANIMATION
function animate() {
  let probability = Math.random();
  //Add new House based on probability
  if (probability < 0.02) {
    let props = {
      levels: Math.floor(Math.random() * 4 + 4),
      wallColour: 'brown',
      roofColour: randomColour(),
      door: Math.random() < 0.5 ? true : false,
    };
    let y = 0.5 + Math.random() * 0.5;
    let size = Math.pow(y, 2) / 3;
    let treeBability = Math.random();

    if (treeBability < 0.4) {
      OBJECTS.push(new Tree([1 + size * 0.5, y], size));
    } else if (treeBability >= 0.4 && treeBability < 0.5) {
      OBJECTS.push(new Bush([1 + size * 0.5, y], size));
    } else {
      OBJECTS.push(new House([1 + size * 0.5, y], size, props));
    }
  }
  //Clear up HOUSE array when out of canvas
  for (let i = 0; i < OBJECTS.length; i++) {
    OBJECTS[i].loc[0] -= SPEED * Math.pow(OBJECTS[i].loc[1], 2);
    if (OBJECTS[i].loc[0] < -OBJECTS[i].scale * 0.5) {
      OBJECTS.splice(i, 1);
      i--;
    }
  }
  // Sort OBJECTS based on size
  OBJECTS.sort((a, b) => {
    return a.scale - b.scale;
  });
  // Sorting old fashoned
  // for (let i = 0; i < OBJECTS.length - 1; i++) {
  //   for (let j = i + 1; j < OBJECTS.length; j++) {
  //     if (OBJECTS[i].scale > OBJECTS[j].scale) {
  //       let aux = OBJECTS[i];
  //       OBJECTS[i] = OBJECTS[j];
  //       OBJECTS[j] = aux;
  //     }
  //   }
  // }
  drawScene();
  window.requestAnimationFrame(animate);
}

function drawScene() {
  let canvas = document.getElementById('myCanvas');
  let ctx = canvas.getContext('2d');
  //Background
  drawBackground(ctx);
  //OBJECTS
  for (let i = 0; i < OBJECTS.length; i++) {
    OBJECTS[i].draw(ctx);
  }
}

class House {
  constructor(loc, scale, props, angle) {
    this.loc = loc;
    this.scale = scale;
    this.props = props;
    this.angle = [];
    for (let i = 0; i < this.props.levels; i++) {
      this.angle[i] = (Math.random() - 0.5) * 0.2;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.loc[0], this.loc[1]);
    ctx.scale(this.scale, this.scale);
    ctx.lineWidth = 0.03;
    ctx.fillStyle = this.props.wallColour;

    //Draw walls of house
    for (let i = 1; i <= this.props.levels; i++) {
      ctx.beginPath();
      ctx.rect(-0.5, -0.1, 1.0, 0.1);
      ctx.stroke();
      ctx.fill();
      ctx.translate(0, -0.1);
      ctx.rotate(this.angle[i]);
    }
    //Draw roof
    ctx.fillStyle = this.props.roofColour;
    ctx.beginPath();
    ctx.moveTo(-0.5, 0);
    ctx.bezierCurveTo(-0.2, 0.06, 0.3, -0.02, 0.5, 0);
    ctx.lineTo(0.0, -0.5);
    ctx.lineTo(-0.5, 0);
    //AVOID strange corners
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();

    //Draw door
    if (this.props.door) {
      ctx.save();
      ctx.translate(this.loc[0], this.loc[1]);
      ctx.scale(this.scale, this.scale);
      ctx.lineWidth = 0.03;
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.rect(0.1, -0.3, 0.2, 0.3);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }
}

//TO SAFELY re-use drawHouse fx:
//1. STORE properties of this ctx

class Tree {
  constructor(loc, scale) {
    this.loc = loc;
    this.scale = scale;
  }

  draw(ctx) {
    //TO SAFELY re-use drawHouse fx:
    //1. STORE properties of this ctx
    ctx.save();
    ctx.translate(this.loc[0], this.loc[1]);
    ctx.scale(this.scale, this.scale);
    ctx.lineWidth = 0.03;
    ctx.fillStyle = 'brown';
    //Draw trunk
    ctx.beginPath();
    ctx.rect(-0.04, -0.15, 0.05, 0.15);
    ctx.stroke();
    ctx.fill();
    //Draw first tree segment
    ctx.beginPath();
    ctx.moveTo(-0.25, -0.15);
    ctx.lineTo(0.25, -0.15);
    ctx.lineTo(0, -0.8);
    ctx.lineTo(-0.25, -0.15);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(149, 255, 38, 1)';
    ctx.fill();
    //2.RESTORE
    ctx.restore();
  }
}
class Bush {
  constructor(loc, scale) {
    this.loc = loc;
    this.scale = scale;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.loc[0], this.loc[1]);
    ctx.scale(this.scale, this.scale);
    ctx.lineWidth = 0.04;
    ctx.fillStyle = 'rgba(32, 83, 14, 1)';
    ctx.beginPath();
    ctx.moveTo(-0.1, 0);
    ctx.bezierCurveTo(-0.4, -0.4, 0.4, -0.4, 0.1, 0);
    ctx.lineTo(-0.1, 0);

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    //Berries
    let berryLoc = [
      [-0.01, -0.07, 0.02],
      [-0.13, -0.2, , 0.018],
      [-0.02, -0.17, 0.014],
      [-0.06, -0.24, 0.021],
      [-0.09, -0.11, 0.017],
      [0.08, -0.09, 0.022],
      [0.1, -0.17, 0.015],
      [0.07, -0.23, 0.022],
    ];

    for (let i = 0; i < berryLoc.length; i++) {
      ctx.save();
      ctx.translate(this.loc[0], this.loc[1]);
      ctx.scale(this.scale, this.scale);
      ctx.lineWidth = 0.01;
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(berryLoc[i][0], berryLoc[i][1], berryLoc[i][2], 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }
}
function drawStreet(ctx, loc, scale, rotate) {
  ctx.save();
  ctx.translate(loc[0], loc[1]);
  ctx.rotate(rotate);
  ctx.scale(scale, scale);
  ctx.lineWidth = 0.02;
  ctx.fillStyle = 'grey';
  ctx.beginPath();
  ctx.moveTo(-0.6, -0.1);
  ctx.bezierCurveTo(-0.4, -0.05, 0.3, -0.15, 0.6, -0.1);
  ctx.lineTo(0.6, -0.05);
  ctx.bezierCurveTo(0.3, -0.1, -0.4, -0.0, -0.6, -0.05);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
  //Dotted line
  ctx.save();
  ctx.translate(loc[0], loc[1]);
  ctx.rotate(rotate);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.lineWidth = 0.005;
  ctx.setLineDash([0.05, 0.015]);
  ctx.moveTo(-0.6, -0.075);
  ctx.bezierCurveTo(-0.4, -0.025, 0.3, -0.125, 0.6, -0.075);
  ctx.stroke();
  ctx.restore();
}
function drawBackground(ctx) {
  //SKY
  ctx.beginPath();
  ctx.fillStyle = 'lightblue';
  ctx.moveTo(0, 0);
  ctx.lineTo(1, 0);
  ctx.lineTo(1, 0.5);
  ctx.bezierCurveTo(0.3, 0.5, 0.8, 0.3, 0, 0.5);
  ctx.lineTo(0, 0);
  ctx.fill();

  //GROUND
  ctx.beginPath();
  ctx.fillStyle = 'green';
  ctx.moveTo(0, 0.5);
  ctx.lineTo(0, 1);
  ctx.lineTo(1, 1);
  ctx.lineTo(1, 0.5);
  ctx.bezierCurveTo(0.3, 0.5, 0.8, 0.3, 0, 0.5);
  ctx.fill();
}

function randomColour() {
  let red = Math.floor(Math.random() * 255);
  let green = Math.floor(Math.random() * 255);
  let blue = Math.floor(Math.random() * 255);
  return 'rgba(' + red + ',' + green + ',' + blue + ',1)';
}

function disappear(sel) {
  let box = document.getElementById(sel);
  box.style.display = 'none';
}
function removeOverlay() {
  let el = document.getElementById('textbox');
  el.style.display = 'none';
}
