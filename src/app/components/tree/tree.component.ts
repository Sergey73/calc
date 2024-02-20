import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { CalculateService, DrawTreeService } from '@services/index';
import { CalcNode } from '@models/index';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit, AfterViewInit {
  treeData$: Observable<CalcNode>;
  @ViewChild('treeContainer', { static: false }) treeContainer: ElementRef<HTMLInputElement>;

  constructor(
    private calculateService: CalculateService,
    private drawTreeService: DrawTreeService
  ) {}

  ngOnInit() {
    this.treeData$ = this.calculateService.tree$;
  }

  ngAfterViewInit() {
    this.drawTreeService.init(this.treeContainer.nativeElement);
    this.treeData$.subscribe((data) => {
      this.drawTreeService.clear();
      if (data) {
        this.drawTreeService.draw(data);
      }
    });
  }
}
