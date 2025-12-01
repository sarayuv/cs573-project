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
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    tsv('data.tsv').then((loadedData) => {
      const formattedData = loadedData
        .map((d) => ({
          ...d,
          heartDisease: +d.num > 0 ? 1 : 0, // 1 if heart disease present, 0 if absent
          age: +d.age, // Convert age to number
        }))
        .filter((d) => d.age); // Remove rows with missing age values
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
        xAxisLabel: 'Age Range (years)',
        yAxisLabel:
          'Percentage (%) within Heart Disease Status Group',
        title:
          'Heart Disease Analysis: Age Distribution by Heart Disease Status',
        xLabelOffset: 60,
        yLabelOffset: 40,
        hoveredType,
        hoveredBar,
      });
    }
  }, [data, hoveredType, hoveredBar]);

  const handleLegendHover = (type) => {
    setHoveredType(type);
    setHoveredBar(null);
  };

  const handleLegendLeave = () => {
    setHoveredType(null);
  };

  const handleBarHover = (type, index) => {
    setHoveredBar({ type, index });
    setHoveredType(null);
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
  };

  // Add event listeners to legend items
  useEffect(() => {
    if (data.length > 0) {
      const legendItems = select(svgRef.current)
        .selectAll('.legend')
        .on('mouseenter', function (event, d) {
          handleLegendHover(d);
        })
        .on('mouseleave', function () {
          handleLegendLeave();
        });

      // Add event listeners to legend text as well
      select(svgRef.current)
        .selectAll('.legend-text')
        .on('mouseenter', function (event, d) {
          handleLegendHover(d);
        })
        .on('mouseleave', function () {
          handleLegendLeave();
        });

      // Add event listeners to bars for no heart disease
      select(svgRef.current)
        .selectAll('.bar-no-heart-disease')
        .on('mouseenter', function (event, d) {
          const index = select(svgRef.current)
            .selectAll('.bar-no-heart-disease')
            .nodes()
            .indexOf(this);
          handleBarHover(0, index);
        })
        .on('mouseleave', function () {
          handleBarLeave();
        });

      // Add event listeners to bars for heart disease
      select(svgRef.current)
        .selectAll('.bar-heart-disease')
        .on('mouseenter', function (event, d) {
          const index = select(svgRef.current)
            .selectAll('.bar-heart-disease')
            .nodes()
            .indexOf(this);
          handleBarHover(1, index);
        })
        .on('mouseleave', function () {
          handleBarLeave();
        });

      return () => {
        legendItems
          .on('mouseenter', null)
          .on('mouseleave', null);
        select(svgRef.current)
          .selectAll('.legend-text')
          .on('mouseenter', null)
          .on('mouseleave', null);
        select(svgRef.current)
          .selectAll('.bar-no-heart-disease')
          .on('mouseenter', null)
          .on('mouseleave', null);
        select(svgRef.current)
          .selectAll('.bar-heart-disease')
          .on('mouseenter', null)
          .on('mouseleave', null);
      };
    }
  }, [data]);

  return createElement('svg', {
    ref: svgRef,
    width,
    height,
  });
};

export { App };
