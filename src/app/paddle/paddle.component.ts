import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import {
  COMPUTER_PADDLE_SPEED,
  PADDLE_POSITION_STRING,
} from '../common/constants';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
})
export class PaddleComponent implements OnInit, AfterViewChecked {
  @Input() name!: 'player' | 'computer';
  @Input() side!: 'left' | 'right';
  element!: HTMLElement;
  hasReset = false;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    const element = document.getElementById(`${this.name}-paddle`);
    if (element) {
      this.element = element;
      if (!this.hasReset) {
        this.hasReset = true;
        this.reset();
      }
    }
  }

  update(delta: number, ballYPosition: number) {
    if (this.name != 'player') {
      this.position +=
        COMPUTER_PADDLE_SPEED * delta * (ballYPosition - this.position);
    }
  }

  reset() {
    this.position = 50;
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.element).getPropertyValue(PADDLE_POSITION_STRING)
    );
  }

  set position(value) {
    this.element.style.setProperty(PADDLE_POSITION_STRING, value.toString());
  }

  get rect() {
    return this.element.getBoundingClientRect();
  }
}
