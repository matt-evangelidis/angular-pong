import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BallComponent } from './ball/ball.component';
import { PaddleComponent } from './paddle/paddle.component';

@NgModule({
  declarations: [
    AppComponent,
    BallComponent,
    PaddleComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
