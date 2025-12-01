import {
  select,
  scaleLinear,
  axisBottom,
  axisLeft,
  max,
  bin,
} from 'd3';

export const viz = (
  selection,
  {
    data,
    width,
    height,
    margin,
    colorScale,
    xAxisLabel,
    yAxisLabel,
    title,
    xLabelOffset = 40,
    yLabelOffset = 40,
    hoveredType = null,
    hoveredBar = null,
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
      }
      .chart-title-text {
        font-family: sans-serif;
        font-size: 24px;
        font-weight: bold;
      }
      .bar-label {
        font-family: sans-serif;
        font-size: 12px;
      }
      .legend {
        cursor: pointer;
      }
      .legend-text {
        font-family: sans-serif;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
      }
      .legend-rect {
        cursor: pointer;
        transition: filter 0.2s ease;
      }
      .legend:hover .legend-rect {
        filter: brightness(1.1);
      }
      .frequency-label {
        font-family: sans-serif;
        font-size: 12px;
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

  // Create age bins
  const ageBins = bin()
    .value((d) => d.age)
    .domain([30, 80])
    .thresholds(10);

  // Separate data by heart disease status
  const noHeartDisease = data.filter(
    (d) => d.heartDisease === 0,
  );
  const heartDisease = data.filter(
    (d) => d.heartDisease === 1,
  );

  // Create bins for each group
  const noHeartDiseaseBins = ageBins(noHeartDisease);
  const heartDiseaseBins = ageBins(heartDisease);

  // Calculate totals for percentage calculation
  const noHeartDiseaseTotal = noHeartDisease.length;
  const heartDiseaseTotal = heartDisease.length;

  // Calculate percentages for each bin
  const noHeartDiseasePercentages = noHeartDiseaseBins.map(
    (d) => (d.length / noHeartDiseaseTotal) * 100,
  );
  const heartDiseasePercentages = heartDiseaseBins.map(
    (d) => (d.length / heartDiseaseTotal) * 100,
  );

  // Get the maximum percentage for y scale
  const maxPercentage = Math.max(
    ...noHeartDiseasePercentages,
    ...heartDiseasePercentages,
  );

  // Create scales
  const xScale = scaleLinear()
    .domain([30, 80])
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain([0, Math.ceil(maxPercentage * 1.1)])
    .range([height - margin.bottom, margin.top]);

  // Calculate bar width based on bin width
  const binWidth = noHeartDiseaseBins[0]
    ? xScale(noHeartDiseaseBins[0].x1) -
      xScale(noHeartDiseaseBins[0].x0)
    : 0;
  const barWidth = binWidth / 2.5; // Width of each individual bar

  // Render bars for no heart disease (0)
  selection
    .selectAll('.bar-no-heart-disease')
    .data(noHeartDiseaseBins)
    .join('rect')
    .attr('class', 'bar-no-heart-disease')
    .attr('x', (d) => xScale(d.x0))
    .attr('y', (d, i) =>
      yScale(noHeartDiseasePercentages[i]),
    )
    .attr(
      'height',
      (d, i) =>
        yScale(0) - yScale(noHeartDiseasePercentages[i]),
    )
    .attr('width', barWidth)
    .attr('fill', colorScale(0))
    .attr('opacity', (d, i) => {
      if (hoveredBar !== null) {
        return hoveredBar.type === 0 &&
          hoveredBar.index === i
          ? 1
          : 0.2;
      }
      return hoveredType === null || hoveredType === 0
        ? 1
        : 0.2;
    })
    .style('cursor', 'pointer');

  // Render bars for heart disease (1)
  selection
    .selectAll('.bar-heart-disease')
    .data(heartDiseaseBins)
    .join('rect')
    .attr('class', 'bar-heart-disease')
    .attr('x', (d) => xScale(d.x0) + barWidth)
    .attr('y', (d, i) => yScale(heartDiseasePercentages[i]))
    .attr(
      'height',
      (d, i) =>
        yScale(0) - yScale(heartDiseasePercentages[i]),
    )
    .attr('width', barWidth)
    .attr('fill', colorScale(1))
    .attr('opacity', (d, i) => {
      if (hoveredBar !== null) {
        return hoveredBar.type === 1 &&
          hoveredBar.index === i
          ? 1
          : 0.2;
      }
      return hoveredType === null || hoveredType === 1
        ? 1
        : 0.2;
    })
    .style('cursor', 'pointer');

  // Render percentage labels for no heart disease
  selection
    .selectAll('.frequency-label-no-heart-disease')
    .data(noHeartDiseaseBins)
    .join('text')
    .attr(
      'class',
      'frequency-label-no-heart-disease frequency-label',
    )
    .attr('x', (d) => xScale(d.x0) + barWidth / 2)
    .attr(
      'y',
      (d, i) => yScale(noHeartDiseasePercentages[i]) - 5,
    )
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .text((d, i) =>
      hoveredBar !== null &&
      hoveredBar.type === 0 &&
      hoveredBar.index === i
        ? noHeartDiseasePercentages[i].toFixed(1) + '%'
        : '',
    )
    .style('pointer-events', 'none');

  // Render percentage labels for heart disease
  selection
    .selectAll('.frequency-label-heart-disease')
    .data(heartDiseaseBins)
    .join('text')
    .attr(
      'class',
      'frequency-label-heart-disease frequency-label',
    )
    .attr(
      'x',
      (d) => xScale(d.x0) + barWidth + barWidth / 2,
    )
    .attr(
      'y',
      (d, i) => yScale(heartDiseasePercentages[i]) - 5,
    )
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .text((d, i) =>
      hoveredBar !== null &&
      hoveredBar.type === 1 &&
      hoveredBar.index === i
        ? heartDiseasePercentages[i].toFixed(1) + '%'
        : '',
    )
    .style('pointer-events', 'none');

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
    .attr('font-weight', 'bold')
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
    .attr('font-weight', 'bold')
    .text(yAxisLabel);

  // Add a legend/key
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
    );

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
      hoveredType === d ? 'black' : 'none',
    )
    .attr('stroke-width', (d) =>
      hoveredType === d ? 2 : 0,
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
      hoveredType === null || hoveredType === d
        ? 'black'
        : '#aaa',
    )
    .attr('font-weight', (d) =>
      hoveredType === d ? 'bold' : 'normal',
    );
};
