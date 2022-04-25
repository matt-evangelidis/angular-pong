import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  BALL_INITIAL_VELOCITY,
  BALL_VELOCITY_INCREMENT,
  BALL_X_POSITION_STRING,
  BALL_Y_POSITION_STRING,
} from '../common/constants';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnInit, AfterViewInit {
  element!: HTMLElement;
  direction: { x: number; y: number } = { x: 0, y: 0 };
  velocity: number = BALL_INITIAL_VELOCITY;

  defaultXPos = 50;
  defaultYPos = 50;

  constructor() {}

  ngOnInit(): void {
    const element = document.getElementById('ball');
    if (element) {
      this.element = element;
      this.reset();
    }
  }

  ngAfterViewInit(): void {}

  update(delta: number, paddleRects: DOMRect[]) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;

    this.velocity += BALL_VELOCITY_INCREMENT * delta;

    const rect = this.rect;
    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
    }

    if (paddleRects.some((r) => this.isCollision(r, rect))) {
      this.direction.x *= -1;
    }
  }

  reset() {
    this.x = this.defaultXPos;
    this.y = this.defaultYPos;
    this.direction = { x: 0, y: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = this.randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }

    this.velocity = BALL_INITIAL_VELOCITY;
  }

  randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  isCollision(rect1: DOMRect, rect2: DOMRect) {
    return (
      rect1.left <= rect2.right &&
      rect1.right >= rect2.left &&
      rect1.top <= rect2.bottom &&
      rect1.bottom >= rect2.top
    );
  }

  get rect() {
    return this.element.getBoundingClientRect();
  }

  get x() {
    return parseFloat(
      getComputedStyle(this.element).getPropertyValue(BALL_X_POSITION_STRING)
    );
  }

  set x(value: number) {
    this.element.style.setProperty(BALL_X_POSITION_STRING, value.toString());
  }

  get y() {
    return parseFloat(
      getComputedStyle(this.element).getPropertyValue(BALL_Y_POSITION_STRING)
    );
  }

  set y(value: number) {
    this.element.style.setProperty(BALL_Y_POSITION_STRING, value.toString());
  }
}
