import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerState.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById('player');
    this.speed = 0;
    this.maxSpeed = 10;
    this.velY = 0;
    this.weight = 1;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    this.fps = 20;
    this.framesInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
    this.currentState = null;
  }
  restart() {
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speed = 0;
    this.velY = 0;
    this.weight = 1;
    this.frameX = 0;
    this.frameY = 0;
    this.frameTimer = 0;
  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);
    //horizontal movement
    this.x += this.speed;
    if (input.includes('ArrowRight') && this.currentState !== this.states[6])
      this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft') && this.currentState !== this.states[6])
      this.speed = -this.maxSpeed;
    else this.speed = 0;
    //horizontal boundaries
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
    //vertical movement
    this.y += this.velY;
    if (!this.onGround()) this.velY += this.weight;
    else this.velY = 0;
    //vertical boundaries
    if (this.y > this.game.height - this.game.groundMargin - this.height)
      this.y = this.game.height - this.game.groundMargin - this.height;
    // sprite animation
    if (this.frameTimer > this.framesInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else this.frameTimer += deltaTime;
  }
  draw(context) {
    if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
        if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
          enemy.game.score++;
          this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 140, 50));
          if (this.game.score >= this.game.winningScore) this.game.gameOver = true;
        } else {
          this.setState(6, 0);
          this.game.score -= 5;
          this.game.lives--;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    });
  }
}
