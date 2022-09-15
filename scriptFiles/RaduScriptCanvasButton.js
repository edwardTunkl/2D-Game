let CANVAS;
let SIZE = 1000;

function main() {
  CANVAS = initializeCanvas('myCanvas');
  HIT_TEST_CANVAS = initializeCanvas('hitTestCanvas');
  let ctx = CANVAS.getContext('2d');
  ButtonHandler.hitTestCanvas = HIT_TEST_CANVAS;
  ButtonHandler.createButton('B1', [SIZE / 2, SIZE / 2], 200, 100, getRandomColour());
  ButtonHandler.createButton('B2', [SIZE / 4, SIZE / 2], 200, 100, getRandomColour());
  ButtonHandler.drawButtons(ctx);
  ButtonHandler.addEventListeners(CANVAS);
}

function initializeCanvas(canvasName) {
  let canvas = document.getElementById(canvasName);
  canvas.width = SIZE;
  canvas.height = SIZE;
  return canvas;
}

class ButtonHandler {
  static buttons = [];
  static hitTestCanvas;

  static createButton(name, loc, width, height, colour) {
    ButtonHandler.buttons.push(new Button(name, loc, width, height, colour));
  }
  static drawButtons(ctx) {
    for (let i = 0; i < ButtonHandler.buttons.length; i++) {
      ButtonHandler.buttons[i].draw(ctx);
    }
    //Also draw buttons on hitTestCanvas
    for (let i = 0; i < ButtonHandler.buttons.length; i++) {
      ButtonHandler.buttons[i].drawHitArea(ButtonHandler.hitTestCanvas.getContext('2d'));
    }
  }
  static addEventListeners(canvas) {
    canvas.addEventListener('mousedown', ButtonHandler.onMouseDown);
    canvas.addEventListener('mousemove', ButtonHandler.onMouseMove);
  }
  static onMouseDown(e) {
    let loc = getMouseLocation(e);
    let colour = getColour(hitTestCanvas.getContext('2d'), loc);
    let button = ButtonHandler.isHovering(colour);
    console.log(button);
  }
  static onMouseMove(e) {
    let loc = getMouseLocation(e);
    let colour = getColour(hitTestCanvas.getContext('2d'), loc);
    ButtonHandler.isHovering(colour)
      ? (CANVAS.style.cursor = 'pointer')
      : (CANVAS.style.cursor = 'auto');
  }
  static isHovering(colour) {
    for (let i = 0; i < ButtonHandler.buttons.length; i++) {
      if (ButtonHandler.buttons[i].colour == colour) {
        return ButtonHandler.buttons[i];
      }
    }
    return false;
  }
}

class Button {
  constructor(name, loc, width, height, colour) {
    this.loc = loc;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.name = name;
  }
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'grey';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.translate(this.loc[0], this.loc[1]);
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = this.height * 0.5 + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.name, 0, 0);
    ctx.restore();
  }
  drawHitArea(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.translate(this.loc[0], this.loc[1]);
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
}
// Utility fxs
function getColour(ctx, loc) {
  let data = ctx.getImageData(loc[0], loc[1], 1, 1);
  return `rgb(${data.data[0]},${data.data[1]},${data.data[2]})`;
}

function getRandomColour() {
  let red = Math.floor(Math.random() * 255);
  let green = Math.floor(Math.random() * 255);
  let blue = Math.floor(Math.random() * 255);
  return `rgb(${red},${green},${blue})`;
}

function getMouseLocation(e) {
  let rect = e.target.getBoundingClientRect();
  let loc = [
    Math.floor((SIZE * (e.clientX - rect.left)) / (rect.right - rect.left)),
    Math.floor((SIZE * (e.clientY - rect.top)) / (rect.bottom - rect.top)),
  ];
  return loc;
}
