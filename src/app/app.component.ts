import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BallComponent } from './ball/ball.component';
import { HUE_RATE_OF_CHANGE, HUE_STRING } from './common/constants';
import { PaddleComponent } from './paddle/paddle.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  lastTime!: number;
  currentAnimationFrameId?: number;
  playerScore = 0;
  computerScore = 0;
  paused = false;
  timescale = 1;

  @ViewChild(BallComponent) ball!: BallComponent;
  @ViewChild('player') playerPaddle!: PaddleComponent;
  @ViewChild('computer') computerPaddle!: PaddleComponent;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.playerPaddle && !this.paused) {
      this.playerPaddle.position = (e.y / window.innerHeight) * 100;
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (this.playerPaddle && !this.paused) {
      console.log(window.innerHeight);
      let newPosition = (e.touches[0].pageY / window.innerHeight) * 100;
      if (newPosition > 95) {
        newPosition = 95;
      }
      else if (newPosition < 5) {
        newPosition = 5;
      }
      this.playerPaddle.position = newPosition;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onPausePress(e: KeyboardEvent) {
    if (e.key == 'p') {
      this.paused = !this.paused;
      this.timescale = this.paused ? 0 : 1;
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.update(0);
  }

  update(time: number) {
    if (this.lastTime) {
      const delta = (time - this.lastTime) * this.timescale;
      this.ball.update(delta, [
        this.playerPaddle.rect,
        this.computerPaddle.rect,
      ]);
      this.computerPaddle.update(delta, this.ball.y);
      this.changeBackgroundColour(delta);
    }

    if (this.hasLost()) {
      this.handleLose();
    }

    this.lastTime = time;
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
  }

  hasLost() {
    const ballRect = this.ball.rect;
    return ballRect.right >= window.innerWidth || ballRect.left <= 0;
  }

  handleLose() {
    const rect = this.ball.rect;
    if (rect.right >= window.innerWidth) {
      this.playerScore++;
    } else if (rect.left <= 0) {
      this.computerScore++;
    }
    this.ball.reset();
    this.computerPaddle.reset();
  }

  changeBackgroundColour(delta: number) {
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(HUE_STRING)
    );
    if (hue) {
      document.documentElement.style.setProperty(
        HUE_STRING,
        (hue + delta * HUE_RATE_OF_CHANGE).toString()
      );
    }
  }
}
