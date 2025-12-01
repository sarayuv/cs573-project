import {
  select,
  scaleLinear,
  extent,
  axisBottom,
  axisLeft,
} from 'd3';

export const viz = (
  selection,
  {
    data,
    xValue,
    yValue,
    r,
    width,
    height,
    margin,
    colorScale,
    xAxisLabel,
    yAxisLabel,
    title,
    xLabelOffset = 40,
    yLabelOffset = 40,
    highlightCategory = null,
  },
) => {
  // Add font styling to the SVG
  selection
    .selectAll('.chart-title')
    .data([null])
    .join('style')
    .attr('class', 'chart-title').text(`
      .tick text, .axis-label {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: bold;
      }
      .chart-title-text {
        font-family: sans-serif;
        font-size: 24px;
        font-weight: bold;
      }
    `);

  // Add chart title with enhanced styling
  selection
    .selectAll('.chart-title-text')
    .data([null])
    .join('text')
    .attr('class', 'chart-title-text')
    .attr('x', width / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .attr('font-weight', 'bold')
    .attr('font-size', '24px')
    .text(title);

  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([height - margin.bottom, margin.top]);

  // Create tooltip div
  const tooltip = select('body')
    .selectAll('.tooltip')
    .data([null])
    .join('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', 'white')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('font-family', 'sans-serif')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  // Render circles with highlight effect and tooltip
  selection
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => xScale(xValue(d)))
    .attr('cy', (d) => yScale(yValue(d)))
    .attr('r', r)
    .attr('fill', (d) => colorScale(d.heartDisease))
    .attr('opacity', (d) =>
      highlightCategory === null ||
      highlightCategory === d.heartDisease
        ? 1
        : 0.2,
    )
    .attr('class', (d) => `point disease-${d.heartDisease}`)
    .on('mouseover', (event, d) => {
      tooltip
        .html(
          `
          <strong>Age:</strong> ${d.age}<br>
          <strong>Sex:</strong> ${d.sex}<br>
          <strong>Heart Disease:</strong> ${d.heartDisease === 1 ? 'Present' : 'Absent'}
        `,
        )
        .style('opacity', 1);
    })
    .on('mousemove', (event) => {
      tooltip
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0);
    });

  // Render x-axis using idempotent pattern
  const xAxisGroup = selection
    .selectAll('.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr(
      'transform',
      `translate(0, ${height - margin.bottom})`,
    );

  xAxisGroup.call(axisBottom(xScale));

  // Add x-axis label
  xAxisGroup
    .selectAll('.x-axis-label')
    .data([null])
    .join('text')
    .attr('class', 'x-axis-label axis-label')
    .attr('x', width / 2)
    .attr('y', xLabelOffset)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .text(xAxisLabel);

  // Render y-axis using idempotent pattern
  const yAxisGroup = selection
    .selectAll('.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left}, 0)`);

  yAxisGroup.call(axisLeft(yScale));

  // Add y-axis label
  yAxisGroup
    .selectAll('.y-axis-label')
    .data([null])
    .join('text')
    .attr('class', 'y-axis-label axis-label')
    .attr('x', -height / 2)
    .attr('y', -yLabelOffset)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text(yAxisLabel);
};

export const addLegend = (
  selection,
  {
    width,
    margin,
    colorScale,
    highlightCategory,
    onHighlightChange,
  },
) => {
  const legendData = [0, 1];
  const legend = selection
    .selectAll('.legend')
    .data(legendData)
    .join('g')
    .attr('class', 'legend')
    .attr(
      'transform',
      (d, i) =>
        `translate(${width - margin.right - 200}, ${margin.top + 10 + i * 25})`,
    )
    .on('mouseenter', (event, d) => {
      onHighlightChange(d);
    })
    .on('mouseleave', () => {
      onHighlightChange(null);
    })
    .style('cursor', 'pointer');

  legend
    .selectAll('rect')
    .data((d) => [d])
    .join('rect')
    .attr('class', 'legend-rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', (d) => colorScale(d))
    .attr('stroke', (d) =>
      highlightCategory === d ? 'black' : 'none',
    )
    .attr('stroke-width', (d) =>
      highlightCategory === d ? 2 : 0,
    );

  legend
    .selectAll('text')
    .data((d) => [d])
    .join('text')
    .attr('class', 'legend-text')
    .attr('x', 20)
    .attr('y', 12)
    .text((d) =>
      d === 0
        ? 'No Heart Disease'
        : 'Heart Disease Present',
    )
    .attr('fill', (d) =>
      highlightCategory === null || highlightCategory === d
        ? 'black'
        : '#aaa',
    )
    .attr('font-weight', (d) =>
      highlightCategory === d ? 'bold' : 'normal',
    )
    .attr('font-family', 'sans-serif')
    .attr('font-size', '14px');
};
