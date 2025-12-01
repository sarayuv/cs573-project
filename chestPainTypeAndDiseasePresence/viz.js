import {
  select,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  max,
  stack,
  stackOrderNone,
  stackOffsetNone,
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
    titleYOffset = 30,
    hoveredType,
    setHoveredType,
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
      .bar-label {
        font-family: sans-serif;
        font-size: 12px;
        opacity: 0;
      }
      .bar-label.visible {
        opacity: 1;
      }
      .series.faded rect {
        opacity: 0.2;
      }
      .legend-text {
        font-family: sans-serif;
        font-size: 14px;
        cursor: pointer;
      }
      .legend-text.highlighted {
        font-weight: bold;
        text-decoration: underline;
      }
      .percentage-display {
        font-family: sans-serif;
        font-size: 12px;
        fill: black;
        pointer-events: none;
      }
    `);

  // Add chart title with enhanced styling
  selection
    .selectAll('.chart-title-text')
    .data([null])
    .join('text')
    .attr('class', 'chart-title-text')
    .attr('x', width / 2)
    .attr('y', titleYOffset)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .attr('font-weight', 'bold')
    .attr('font-size', '24px')
    .text(title);

  // Create stacked bar chart data
  const chestPainTypes = [
    ...new Set(data.map((d) => d.cp)),
  ];
  const diseasePresence = [0, 1];

  const stackedData = chestPainTypes.map(
    (chestPainType) => {
      const counts = { cp: chestPainType };
      diseasePresence.forEach((presence) => {
        counts[presence] = data.filter(
          (d) =>
            d.cp === chestPainType &&
            d.heartDisease === presence,
        ).length;
      });
      return counts;
    },
  );

  // Convert counts to percentages
  const stackedDataPercent = stackedData.map((d) => {
    const total = d[0] + d[1];
    return {
      cp: d.cp,
      0: total > 0 ? (d[0] / total) * 100 : 0,
      1: total > 0 ? (d[1] / total) * 100 : 0,
    };
  });

  const series = stack()
    .keys(diseasePresence)
    .order(stackOrderNone)
    .offset(stackOffsetNone)(stackedDataPercent);

  const xScale = scaleBand()
    .domain(chestPainTypes)
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const yScale = scaleLinear()
    .domain([0, 100]) // Percentages go from 0 to 100
    .range([height - margin.bottom, margin.top]);

  const barWidth = xScale.bandwidth();

  // Render bars with interactivity
  const seriesGroups = selection
    .selectAll('.series')
    .data(series)
    .join('g')
    .attr('class', 'series')
    .attr('fill', (d) => colorScale(d.key));

  const allRects = seriesGroups
    .selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('x', (d) => xScale(d.data.cp))
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
    .attr('width', barWidth)
    .on('mouseenter', function (event, d) {
      // Highlight the hovered segment
      select(this)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

      // Fade all other segments
      selection.selectAll('.series').classed('faded', true);
      select(this.parentNode).classed('faded', false);

      // Show only the label for the hovered segment
      selection
        .selectAll('.bar-label')
        .classed('visible', false);
      select(this).attr(
        'data-label-id',
        `${d.data.cp}-${d.key}`,
      );

      // Create or update percentage display for just this segment
      selection
        .selectAll('.percentage-display')
        .data([
          {
            cp: d.data.cp,
            percentage: d[1] - d[0],
            key: d.key,
          },
        ])
        .join('text')
        .attr('class', 'percentage-display')
        .attr('x', xScale(d.data.cp) + barWidth / 2)
        .attr(
          'y',
          yScale(d[1]) +
            (yScale(d[0]) - yScale(d[1])) / 2 +
            5,
        )
        .attr('text-anchor', 'middle')
        .text(`${(d[1] - d[0]).toFixed(1)}%`);
    })
    .on('mouseleave', function () {
      // Remove highlight
      select(this)
        .attr('stroke', null)
        .attr('stroke-width', null);

      // Remove fading
      selection
        .selectAll('.series')
        .classed('faded', false);

      // Hide all labels
      selection
        .selectAll('.bar-label')
        .classed('visible', false);

      // Remove percentage display
      selection.selectAll('.percentage-display').remove();
    });

  // Add percentage labels on bars
  const labelGroups = selection
    .selectAll('.bar-label-group')
    .data(series)
    .join('g')
    .attr('class', 'bar-label-group');

  labelGroups
    .selectAll('.bar-label')
    .data((d) => d)
    .join('text')
    .attr('class', 'bar-label')
    .attr('data-id', (d) => `${d.data.cp}-${d.key}`)
    .attr('x', (d) => xScale(d.data.cp) + barWidth / 2)
    .attr('y', (d) => {
      // Calculate the middle of the bar segment
      return (
        yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2 + 5
      );
    })
    .attr('text-anchor', 'middle')
    .text((d) => {
      // d[0] and d[1] already contain percentage values from the stacked data
      const percentageValue = d[1] - d[0];
      return `${percentageValue.toFixed(1)}%`;
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

  // Add a legend/key at bottom right
  const legendData = [0, 1];
  const legend = selection
    .selectAll('.legend')
    .data(legendData)
    .join('g')
    .attr('class', 'legend')
    .attr(
      'transform',
      (d, i) =>
        `translate(${width - margin.right - 150}, ${height - margin.bottom + 35 + i * 25})`,
    )
    .on('mouseenter', function (event, d) {
      setHoveredType(d);
      // Highlight the corresponding series
      selection.selectAll('.series').classed('faded', true);
      selection
        .selectAll('.series')
        .filter((s) => s.key === d)
        .classed('faded', false);

      // Show all labels for this series
      selection
        .selectAll('.bar-label')
        .classed('visible', false);
      selection
        .selectAll('.bar-label')
        .filter((labelData) => labelData.key === d)
        .classed('visible', true);

      // Display percentages for all segments with this color on the bars
      const percentages = stackedDataPercent.map(
        (item) => ({
          cp: item.cp,
          percentage: item[d],
          key: d,
        }),
      );

      // Create or update percentage display on bars
      selection
        .selectAll('.percentage-display')
        .data(percentages)
        .join('text')
        .attr('class', 'percentage-display')
        .attr('x', (item) => xScale(item.cp) + barWidth / 2)
        .attr('y', (item) => {
          // Find the corresponding bar segment to position the text on
          const seriesData = series.find(
            (s) => s.key == item.key,
          );
          if (!seriesData) return 0;

          const barSegment = seriesData.find(
            (segment) => segment.data.cp === item.cp,
          );
          if (!barSegment) return 0;

          // Position text in the middle of the bar segment
          return (
            yScale(barSegment[1]) +
            (yScale(barSegment[0]) -
              yScale(barSegment[1])) /
              2 +
            5
          );
        })
        .attr('text-anchor', 'middle')
        .text((item) => `${item.percentage.toFixed(1)}%`);
    })
    .on('mouseleave', function () {
      setHoveredType(null);
      // Remove highlight from all series
      selection
        .selectAll('.series')
        .classed('faded', false);

      // Hide all labels
      selection
        .selectAll('.bar-label')
        .classed('visible', false);

      // Remove percentage display
      selection.selectAll('.percentage-display').remove();
    });

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
