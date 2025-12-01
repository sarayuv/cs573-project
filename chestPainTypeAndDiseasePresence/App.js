import {
  useRef,
  useEffect,
  createElement,
  useState,
} from 'react';
import { select, tsv, scaleOrdinal } from 'd3';
import { viz } from './viz.js';

const width = 960;
const height = 500;
const margin = {
  top: 60,
  right: 20,
  bottom: 100,
  left: 60,
};

const App = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [hoveredType, setHoveredType] = useState(null);

  useEffect(() => {
    tsv('data.tsv').then((loadedData) => {
      const formattedData = loadedData
        .map((d) => ({
          ...d,
          heartDisease: +d.num > 0 ? 1 : 0, // 1 if heart disease present, 0 if absent
        }))
        .filter((d) => d.cp); // Remove rows with missing cp values
      setData(formattedData);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const svg = select(svgRef.current);

      // Create a color scale for heart disease (0 = absent, 1 = present) with red and blue scheme
      const colorScale = scaleOrdinal()
        .domain([0, 1])
        .range(['#4682B4', '#DC143C']); // Blue for no heart disease, Red for heart disease

      viz(svg, {
        data,
        width,
        height,
        margin,
        colorScale: (d) => colorScale(d),
        xAxisLabel: 'Chest Pain Type',
        yAxisLabel: 'Percentage of People',
        title:
          'Heart Disease Analysis: Heart Disease Presence by Chest Pain Type',
        xLabelOffset: 60,
        yLabelOffset: 40,
        hoveredType,
        setHoveredType,
        titleYOffset: 35,
      });
    }
  }, [data, hoveredType]);

  return createElement('svg', {
    ref: svgRef,
    width,
    height,
  });
};

export { App };
