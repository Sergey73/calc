import { Injectable } from '@angular/core';
import * as d3 from 'd3';

import { CalcNode } from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class DrawTreeService {
  element: HTMLInputElement = null;

  constructor() {}

  init(value: HTMLInputElement) {
    this.element = value;
  }

  draw(treeData: CalcNode) {
    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 660 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const treemap = d3.tree<CalcNode>().size([width, height]);
    const nodes: d3.HierarchyNode<CalcNode> = d3.hierarchy(treeData);
    const pointNodes: d3.HierarchyPointNode<CalcNode> = treemap(nodes);

    const svg = d3
      .select(this.element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('.link')
      .data(pointNodes.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', '2px')
      .attr('d', (d: d3.HierarchyPointNode<CalcNode>) => {
        return `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`;
      });

    const node = g
      .selectAll('.node')
      .data(pointNodes.descendants())
      .enter()
      .append('g')
      .attr('transform', (d: d3.HierarchyPointNode<CalcNode>) => {
        return `translate(${d.x},${d.y})`;
      });

    node
      .append('circle')
      .attr('r', 15)
      .attr('stroke', 'rgb(255, 128, 0)')
      .attr('fill', 'rgb(96, 96, 96)')
      .attr('stroke-width', '3px');

    node
      .append('text')
      .attr('y', '5px')
      .attr('font-size', '14px')
      .style('fill', '#fff')
      .style('text-anchor', 'middle')
      .text((d: d3.HierarchyPointNode<CalcNode>) => {
        return d.data.name;
      });
  }

  clear() {
    d3.select('svg').remove();
  }
}
