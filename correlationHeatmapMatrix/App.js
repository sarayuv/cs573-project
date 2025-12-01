import {
  useRef,
  useEffect,
  createElement,
  useState,
} from 'react';
import { select, tsv } from 'd3';
import { viz } from './viz.js';

const width = 600;
const height = 600;
const margin = {
  top: 60,
  right: 80,
  bottom: 80,
  left: 80,
};

const App = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [selectedVariable, setSelectedVariable] =
    useState(null);

  useEffect(() => {
    tsv('data.tsv').then((loadedData) => {
      const formattedData = loadedData
        .map((d) => ({
          ...d,
          age: +d.age,
          trestbps: +d.trestbps,
          chol: +d.chol,
          thalch: +d.thalch,
          oldpeak: +d.oldpeak,
        }))
        .filter(
          (d) =>
            !isNaN(d.age) &&
            !isNaN(d.trestbps) &&
            !isNaN(d.chol) &&
            !isNaN(d.thalch) &&
            !isNaN(d.oldpeak),
        );
      setData(formattedData);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const svg = select(svgRef.current);

      viz(svg, {
        data,
        width,
        height,
        margin,
        xLabelOffset: 60,
        yLabelOffset: 40,
        threshold,
        sortBy,
        selectedVariable,
      });
    }
  }, [data, threshold, sortBy, selectedVariable]);

  return createElement(
    'div',
    {
      style: {
        fontFamily: 'sans-serif',
        padding: '15px',
        maxWidth: '1400px',
        margin: '0 auto',
      },
    },
    createElement(
      'h1',
      {
        style: {
          marginTop: 0,
          marginBottom: '20px',
          fontSize: '24px',
        },
      },
      'Correlation Heatmap: Heart Disease Dataset',
    ),
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-start',
        },
      },
      createElement(
        'div',
        {
          style: {
            flex: '0 0 auto',
          },
        },
        createElement('svg', {
          ref: svgRef,
          width,
          height,
          style: {
            border: '1px solid #ccc',
            borderRadius: '4px',
            display: 'block',
            backgroundColor: '#fff',
          },
        }),
        createElement(
          'div',
          {
            style: {
              marginTop: '10px',
              padding: '8px',
              fontSize: '11px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              color: '#666',
              maxWidth: width,
            },
          },
          'Hover over cells to see detailed correlation values.',
        ),
      ),
      createElement(
        'div',
        {
          style: {
            flex: '1 1 auto',
            minWidth: '250px',
            paddingTop: '60px',
          },
        },
        createElement(
          'div',
          {
            style: {
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            },
          },
          createElement(
            'div',
            null,
            createElement(
              'label',
              {
                htmlFor: 'threshold-slider',
                style: {
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                },
              },
              'Filter Strength',
            ),
            createElement(
              'div',
              {
                style: {
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '8px',
                },
              },
              '|r| ≥ ',
              createElement(
                'strong',
                null,
                threshold.toFixed(2),
              ),
            ),
            createElement('input', {
              id: 'threshold-slider',
              type: 'range',
              min: '0',
              max: '1',
              step: '0.1',
              value: threshold,
              onChange: (e) =>
                setThreshold(parseFloat(e.target.value)),
              style: {
                width: '100%',
                cursor: 'pointer',
              },
            }),
            createElement(
              'div',
              {
                style: {
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '6px',
                },
              },
              '0.0 (all) — 1.0 (only perfect)',
            ),
          ),
          createElement(
            'div',
            null,
            createElement(
              'label',
              {
                htmlFor: 'sort-select',
                style: {
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                },
              },
              'Sort Variables By',
            ),
            createElement(
              'select',
              {
                id: 'sort-select',
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
                style: {
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '13px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                },
              },
              createElement(
                'option',
                { value: 'default' },
                'Default Order',
              ),
              createElement(
                'option',
                { value: 'alphabetical' },
                'Alphabetical',
              ),
              createElement(
                'option',
                { value: 'strength' },
                'Correlation Strength',
              ),
            ),
          ),
          createElement(
            'div',
            null,
            createElement(
              'label',
              {
                htmlFor: 'highlight-select',
                style: {
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                },
              },
              'Highlight Variable',
            ),
            createElement(
              'select',
              {
                id: 'highlight-select',
                value: selectedVariable || '',
                onChange: (e) =>
                  setSelectedVariable(
                    e.target.value || null,
                  ),
                style: {
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '13px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                },
              },
              createElement(
                'option',
                { value: '' },
                'None',
              ),
              createElement(
                'option',
                { value: 'age' },
                'Age',
              ),
              createElement(
                'option',
                { value: 'trestbps' },
                'Resting BP',
              ),
              createElement(
                'option',
                { value: 'chol' },
                'Cholesterol',
              ),
              createElement(
                'option',
                { value: 'thalch' },
                'Max HR',
              ),
              createElement(
                'option',
                { value: 'oldpeak' },
                'ST Depression',
              ),
            ),
          ),
        ),
      ),
    ),
  );
};

export { App };
