import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const Tooltip = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  pointer-events: none;
  font-size: 12px;
  visibility: hidden;
`;

const BubbleChart = ({ coins }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const width = parseInt(svg.style('width'));
    const height = parseInt(svg.style('height'));

    const pack = d3.pack()
      .size([width, height])
      .padding(2);

    const root = d3.hierarchy({ children: coins })
      .sum(d => d.market_cap || 1) // Fallback for missing data
      .sort((a, b) => b.value - a.value);

    const nodes = pack(root).leaves();

    const nodeGroup = svg.selectAll('g').data(nodes, d => d.data.id);

    const nodeEnter = nodeGroup
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Append circles
    nodeEnter
      .append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => d3.schemeCategory10[d.data.market_cap_rank % 10])
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible').text(`${d.data.name}: $${d.data.current_price}`);
      })
      .on('mousemove', event => {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Append labels
    nodeEnter
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', d => `${Math.min(d.r / 3, 12)}px`)
      .text(d => d.data.symbol?.toUpperCase() || '');

    // Merge and update
    nodeGroup
      .merge(nodeEnter)
      .transition()
      .duration(500)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Remove old nodes
    nodeGroup.exit().remove();

    const simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('collide', d3.forceCollide(d => d.r + 2))
      .alphaDecay(0.03)
      .on('tick', () => {
        svg
          .selectAll('g')
          .attr('transform', d => `translate(${d.x}, ${d.y})`);
      });

    return () => {
      simulation.stop();
    };
  }, [coins]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      <Tooltip ref={tooltipRef} />
    </div>
  );
};

export default BubbleChart;
