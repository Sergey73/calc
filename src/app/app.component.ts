import { Component } from '@angular/core';

import { CalculatorComponent, TreeComponent } from '@components/index';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TreeComponent, CalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
