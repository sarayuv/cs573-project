import {
  select,
  scaleLinear,
  scaleSequential,
  max,
  min,
  extent,
} from 'd3';

export const viz = (
  selection,
  {
    data,
    width,
    height,
    margin,
    title,
    xLabelOffset = 40,
    yLabelOffset = 40,
    threshold = 0,
    sortBy = 'default',
    selectedVariable = null,
  },
) => {
  // Clear previous content
  selection.selectAll('*').remove();

  // Add font styling to the SVG
  selection.append('defs').append('style').text(`
      .tick text, .axis-label {
        font-family: sans-serif;
        font-size: 11px;
      }
      .chart-title-text {
        font-family: sans-serif;
        font-size: 16px;
        font-weight: bold;
      }
      .cell-label {
        font-family: sans-serif;
        font-size: 9px;
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
      }
      .heatmap-cell {
        cursor: pointer;
        transition: stroke-width 0.2s;
      }
      .heatmap-cell:hover {
        stroke-width: 2 !important;
        stroke: #000 !important;
      }
      .heatmap-cell.selected {
        stroke: #FFD700 !important;
        stroke-width: 3 !important;
      }
      .heatmap-cell.highlighted {
        opacity: 1;
      }
      .heatmap-cell.dimmed {
        opacity: 0.3;
      }
    `);

  // Select only numeric columns for correlation
  let numericColumns = [
    'age',
    'trestbps',
    'chol',
    'thalch',
    'oldpeak',
  ];

  // Create mapping from abbreviated names to readable labels
  const columnLabels = {
    age: 'Age',
    trestbps: 'Resting BP',
    chol: 'Cholesterol',
    thalch: 'Max HR',
    oldpeak: 'ST Depression',
  };

  // Convert data to numeric values
  const numericData = data.map((d) => {
    const row = {};
    numericColumns.forEach((col) => {
      row[col] = +d[col];
    });
    return row;
  });

  // Calculate correlations
  let correlations = [];
  numericColumns.forEach((col1, i) => {
    numericColumns.forEach((col2, j) => {
      correlations.push({
        row: i,
        col: j,
        rowName: col1,
        colName: col2,
        value: calculateCorrelation(
          numericData.map((d) => d[col1]),
          numericData.map((d) => d[col2]),
        ),
      });
    });
  });

  // Apply sorting
  if (sortBy === 'alphabetical') {
    numericColumns = numericColumns.sort();
    correlations = correlations.map((c) => {
      const newRow = numericColumns.indexOf(c.rowName);
      const newCol = numericColumns.indexOf(c.colName);
      return { ...c, row: newRow, col: newCol };
    });
  } else if (sortBy === 'strength') {
    // Sort by average absolute correlation
    const avgCorr = {};
    numericColumns.forEach((col) => {
      const avg =
        correlations
          .filter(
            (c) => c.rowName === col || c.colName === col,
          )
          .reduce((sum, c) => sum + Math.abs(c.value), 0) /
        (numericColumns.length * 2 - 1);
      avgCorr[col] = avg;
    });
    numericColumns = numericColumns.sort(
      (a, b) => avgCorr[b] - avgCorr[a],
    );
    correlations = correlations.map((c) => {
      const newRow = numericColumns.indexOf(c.rowName);
      const newCol = numericColumns.indexOf(c.colName);
      return { ...c, row: newRow, col: newCol };
    });
  }

  // Filter by threshold
  const visibleCorrelations = correlations.filter(
    (c) => Math.abs(c.value) >= threshold,
  );

  // Calculate correlation between two arrays
  function calculateCorrelation(xs, ys) {
    const validPairs = xs
      .map((x, i) => [x, ys[i]])
      .filter((pair) => !isNaN(pair[0]) && !isNaN(pair[1]));

    if (validPairs.length === 0) return 0;

    const validXs = validPairs.map((pair) => pair[0]);
    const validYs = validPairs.map((pair) => pair[1]);

    const meanX =
      validXs.reduce((a, b) => a + b, 0) / validXs.length;
    const meanY =
      validYs.reduce((a, b) => a + b, 0) / validYs.length;

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < validXs.length; i++) {
      const diffX = validXs[i] - meanX;
      const diffY = validYs[i] - meanY;

      numerator += diffX * diffY;
      denominatorX += diffX * diffX;
      denominatorY += diffY * diffY;
    }

    const denominator = Math.sqrt(
      denominatorX * denominatorY,
    );

    if (denominator === 0) return 0;

    return numerator / denominator;
  }

  // Set up scales
  const cellSize = Math.min(
    (width - margin.left - margin.right) /
      numericColumns.length,
    (height - margin.top - margin.bottom) /
      numericColumns.length,
  );

  // Calculate offset to center the heatmap
  const heatmapWidth = cellSize * numericColumns.length;
  const heatmapHeight = cellSize * numericColumns.length;
  const xOffset =
    margin.left +
    (width - margin.left - margin.right - heatmapWidth) / 2;
  const yOffset =
    margin.top +
    (height - margin.top - margin.bottom - heatmapHeight) /
      2;

  const xScale = scaleLinear()
    .domain([0, numericColumns.length])
    .range([
      xOffset,
      xOffset + cellSize * numericColumns.length,
    ]);

  const yScale = scaleLinear()
    .domain([0, numericColumns.length])
    .range([
      yOffset,
      yOffset + cellSize * numericColumns.length,
    ]);

  // Custom color scale
  const colorScale = scaleLinear()
    .domain([-1, 0, 1])
    .range(['#FF0000', '#FFFFFF', '#4682B4']);

  // Add chart title
  selection
    .append('text')
    .attr('class', 'chart-title-text')
    .attr('x', width / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .text(title);

  // Add threshold info
  if (threshold > 0) {
    selection
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2 + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .attr('font-size', '10px')
      .text(
        `Showing correlations with |r| ≥ ${threshold.toFixed(2)}`,
      );
  }

  // Create tooltip div
  const tooltip = select('body')
    .selectAll('.heatmap-tooltip')
    .data([null])
    .join('div')
    .attr('class', 'heatmap-tooltip')
    .style('position', 'absolute')
    .style('padding', '12px')
    .style('background', 'rgba(0, 0, 0, 0.9)')
    .style('color', '#fff')
    .style('border-radius', '4px')
    .style('pointer-events', 'none')
    .style('font-family', 'sans-serif')
    .style('font-size', '13px')
    .style('z-index', '10')
    .style('opacity', 0)
    .style('max-width', '250px');

  // Render heatmap cells
  selection
    .selectAll('.heatmap-cell')
    .data(correlations)
    .join('rect')
    .attr('class', (d) => {
      let classes = 'heatmap-cell';
      if (selectedVariable) {
        if (
          d.rowName === selectedVariable ||
          d.colName === selectedVariable
        ) {
          classes += ' highlighted';
        } else {
          classes += ' dimmed';
        }
      }
      return classes;
    })
    .attr('x', (d) => xScale(d.col))
    .attr('y', (d) => yScale(d.row))
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('fill', (d) => {
      if (Math.abs(d.value) < threshold) {
        return '#f0f0f0';
      }
      return colorScale(d.value);
    })
    .attr('stroke', (d) =>
      Math.abs(d.value) < threshold ? '#e0e0e0' : '#ccc',
    )
    .attr('stroke-width', 0.5)
    .on('mouseover', (event, d) => {
      const correlationDescription =
        getCorrelationDescription(d.value);
      tooltip.style('opacity', 1).html(`
        <strong>${columnLabels[d.rowName]} ↔ ${columnLabels[d.colName]}</strong><br/>
        <hr style="margin: 6px 0; border: none; border-top: 1px solid #666;">
        <strong>r =</strong> ${d.value.toFixed(4)}<br/>
        <strong>|r| =</strong> ${Math.abs(d.value).toFixed(4)}<br/>
        <em style="color: #aaa;">${correlationDescription}</em>
      `);
    })
    .on('mousemove', (event) => {
      tooltip
        .style('left', event.pageX + 15 + 'px')
        .style('top', event.pageY - 10 + 'px');
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0);
    });

  // Add correlation value labels
  selection
    .selectAll('.cell-label')
    .data(correlations)
    .join('text')
    .attr('class', 'cell-label')
    .attr('x', (d) => xScale(d.col) + cellSize / 2)
    .attr('y', (d) => yScale(d.row) + cellSize / 2)
    .text((d) => {
      if (Math.abs(d.value) < threshold) {
        return '';
      }
      return d.value.toFixed(2);
    })
    .attr('opacity', (d) => {
      if (selectedVariable) {
        if (
          d.rowName === selectedVariable ||
          d.colName === selectedVariable
        ) {
          return 1;
        } else {
          return 0.2;
        }
      }
      return 1;
    })
    .attr('fill', (d) => {
      if (Math.abs(d.value) < threshold) {
        return '#999';
      }
      if (d.row === d.col) return 'black';
      const absValue = Math.abs(d.value);
      if (absValue > 0.7) return 'white';
      if (absValue > 0.4) return '#333';
      return 'black';
    });

  // Add column labels
  selection
    .selectAll('.column-label')
    .data(numericColumns)
    .join('text')
    .attr('class', 'column-label axis-label')
    .attr('x', (d, i) => xScale(i) + cellSize / 2)
    .attr('y', yOffset - 8)
    .attr('text-anchor', 'middle')
    .text((d) => columnLabels[d] || d)
    .attr('fill', (d) =>
      selectedVariable === d ? '#4682B4' : 'black',
    )
    .style('font-weight', (d) =>
      selectedVariable === d ? 'bold' : 'normal',
    );

  // Add row labels
  selection
    .selectAll('.row-label')
    .data(numericColumns)
    .join('text')
    .attr('class', 'row-label axis-label')
    .attr('x', xOffset - 8)
    .attr('y', (d, i) => yScale(i) + cellSize / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .text((d) => columnLabels[d] || d)
    .attr('fill', (d) =>
      selectedVariable === d ? '#4682B4' : 'black',
    )
    .style('font-weight', (d) =>
      selectedVariable === d ? 'bold' : 'normal',
    );

  // Add compact legend centered below heatmap
  const legendWidth = 140;
  const legendHeight = 15;
  const legendX = width / 2 - legendWidth / 2;
  const legendY = yOffset + heatmapHeight + 30;

  // Create gradient for legend
  const defs = selection.select('defs');

  const gradient = defs
    .selectAll('linearGradient')
    .data([null])
    .join('linearGradient')
    .attr('id', 'heatmap-gradient')
    .attr('x1', '0%')
    .attr('x2', '100%')
    .attr('y1', '0%')
    .attr('y2', '0%');

  gradient
    .selectAll('stop')
    .data([
      { offset: '0%', color: '#FF0000' },
      { offset: '50%', color: '#FFFFFF' },
      { offset: '100%', color: '#4682B4' },
    ])
    .join('stop')
    .attr('offset', (d) => d.offset)
    .attr('stop-color', (d) => d.color);

  // Draw legend rectangle
  selection
    .selectAll('.legend-rect')
    .data([null])
    .join('rect')
    .attr('class', 'legend-rect')
    .attr('x', legendX)
    .attr('y', legendY)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', 'url(#heatmap-gradient)')
    .attr('stroke', '#999')
    .attr('stroke-width', 0.5);

  // Add legend labels (simplified)
  const legendLabels = [
    { val: -1, label: '-1' },
    { val: 0, label: '0' },
    { val: 1, label: '+1' },
  ];

  selection
    .selectAll('.legend-label')
    .data(legendLabels)
    .join('text')
    .attr('class', 'legend-label axis-label')
    .attr('x', (d) => {
      if (d.val === -1) return legendX;
      if (d.val === 0) return legendX + legendWidth / 2;
      return legendX + legendWidth;
    })
    .attr('y', legendY + legendHeight + 10)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .text((d) => d.label)
    .attr('fill', 'black');

  // Helper function to describe correlation strength
  function getCorrelationDescription(value) {
    const absValue = Math.abs(value);
    if (absValue >= 0.7) return 'Strong correlation';
    if (absValue >= 0.4) return 'Moderate correlation';
    if (absValue >= 0.2) return 'Weak correlation';
    return 'Very weak or negligible correlation';
  }
};
