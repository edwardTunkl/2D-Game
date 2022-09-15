export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 20;
    this.fontFamily = 'Pixel';
    this.livesImage = document.getElementById('lives');
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 1;
    context.shadowColor = 'white';
    context.shadowBlur = 0;
    context.font = this.fontSize + 'px ' + this.fontFamily;
    context.textAlign = 'left';
    context.fillStyle = this.game.fontColor;
    //score
    context.fillText('Score: ' + this.game.score, 20, 50);
    //timer
    context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
    context.fillText('Time: ' + (this.game.time * 0.001).toFixed(0), 20, 80);
    //lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
    }
    // game over message
    if (this.game.gameOver) {
      context.textAlign = 'center';
      context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
      if (this.game.score >= this.game.winningScore) {
        context.fillStyle = 'blue';
        context.fillText('F*ck Yeah!!!', this.game.width * 0.5, this.game.height * 0.5 - 20);
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillStyle = 'black';
        context.fillText(
          'You did very well, freaky little poodle!',
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        context.save();
        context.fillText('You', this.game.width * 0.5 - 100, this.game.height * 0.5 - 20);
        context.fillStyle = 'red';
        context.fillText('failed!', this.game.width * 0.5 + 60, this.game.height * 0.5 - 20);
        context.restore();
        context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
        context.fillText(
          'You better get this right!!!',
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.fillText('Press ', this.game.width * 0.5 - 100, this.game.height * 0.5 + 55);
        context.fillStyle = 'green';
        context.fillText('ENTER ', this.game.width * 0.5 - 15, this.game.height * 0.5 + 55);
        context.fillStyle = 'black';
        context.fillText('to restart', this.game.width * 0.5 + 100, this.game.height * 0.5 + 55);
      }
    }
    context.restore();
  }
}
