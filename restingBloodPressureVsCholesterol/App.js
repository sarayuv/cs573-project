import {
  useRef,
  useEffect,
  createElement,
  useState,
} from 'react';
import { select, tsv, scaleOrdinal } from 'd3';
import { viz, addLegend } from './viz.js';

const width = 960;
const height = 500;
const margin = {
  top: 60,
  right: 20,
  bottom: 60,
  left: 60,
};

const App = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [highlightCategory, setHighlightCategory] =
    useState(null);

  useEffect(() => {
    tsv('data.tsv').then((loadedData) => {
      const formattedData = loadedData
        .map((d) => ({
          ...d,
          trestbps: d.trestbps ? +d.trestbps : NaN,
          chol: d.chol ? +d.chol : NaN,
          heartDisease: +d.num > 0 ? 1 : 0, // 1 if heart disease present, 0 if absent
        }))
        .filter(
          (d) =>
            !isNaN(d.trestbps) &&
            !isNaN(d.chol) &&
            d.chol > 0,
        );
      setData(formattedData);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const svg = select(svgRef.current);

      // Create a color scale for heart disease (0 = absent, 1 = present)
      const colorScale = scaleOrdinal()
        .domain([0, 1])
        .range(['#4682B4', '#DC143C']); // Steel blue for no heart disease, crimson for heart disease

      viz(svg, {
        data,
        width,
        height,
        margin,
        xValue: (d) => d.trestbps,
        yValue: (d) => d.chol,
        r: 6.5,
        colorScale: (d) => colorScale(d),
        xAxisLabel: 'Resting Blood Pressure (mm Hg)',
        yAxisLabel: 'Cholesterol (mg/dl)',
        title:
          'Heart Disease Analysis: Resting Blood Pressure vs Cholesterol',
        xLabelOffset: 40,
        yLabelOffset: 40,
        highlightCategory,
      });

      addLegend(svg, {
        width,
        margin,
        colorScale,
        highlightCategory,
        onHighlightChange: setHighlightCategory,
      });
    }
  }, [data, highlightCategory]);

  return createElement('svg', {
    ref: svgRef,
    width,
    height,
  });
};

export { App };
