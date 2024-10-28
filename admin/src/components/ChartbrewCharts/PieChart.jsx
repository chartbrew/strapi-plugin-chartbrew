import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTheme } from 'styled-components';

import strapifyChartData from '../../utils/strapifyChartData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const dataLabelsPlugin = {
  font: {
    weight: "bold",
    size: 12,
    family: "Inter",
  },
  padding: 4,
  formatter: (value, context) => {
    let formattedValue = value;
    try {
      formattedValue = parseFloat(value);
    } catch (e) {
      // do nothing
    }

    const hiddens = context.chart._hiddenIndices;
    let total = 0;
    const datapoints = context.dataset.data;
    datapoints.forEach((val, i) => {
      let formattedVal = val;
      try {
        formattedVal = parseFloat(val);
      } catch (e) {
        // do nothing
      }

      if (hiddens[i] !== undefined) {
        if (!hiddens[i]) {
          total += formattedVal;
        }
      } else {
        total += formattedVal;
      }
    });
    const percentage = `${((formattedValue / total) * 100).toFixed(2)}%`;
    const out = percentage;
    return out;
  },
  display(context) {
    const { dataset } = context;
    const count = dataset.data.length;
    const value = dataset.data[context.dataIndex];
    return value > count * 1.5;
  },
  backgroundColor(context) {
    return context.dataset.backgroundColor;
  },
  borderColor: "white",
  borderRadius: 6,
  borderWidth: 2,
};

function PieChart(props) {
  const {
    chart, redraw, redrawComplete,
  } = props;

  const { colors } = useTheme();

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw, redrawComplete]);

  const _getChartOptions = () => {
    const chartOptions = chart?.chartData?.options;
    // add any dynamic changes to the chartJS options here
    if (chartOptions) {
      const newOptions = JSON.parse(JSON.stringify(chartOptions));
      if (newOptions.plugins?.legend?.labels) {
        newOptions.plugins.legend.labels.color = colors.neutral800;
      }
      return newOptions;
    }

    return chartOptions;
  };

  return (
    <div style={{ height: "100%", width: '100%', display: 'flex', flexDirection: 'column' }}>
      {chart.chartData.data && chart.chartData.data.labels && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <Pie
            data={chart.chartData.data}
            options={{
              ..._getChartOptions(),
              plugins: {
                ..._getChartOptions().plugins,
                datalabels: dataLabelsPlugin,
              },
            }}
            redraw={redraw}
            plugins={[ChartDataLabels]}
          />
        </div>
      )}
    </div>
  );
}

PieChart.defaultProps = {
  redraw: false,
  redrawComplete: () => { },
};

PieChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
};

export default PieChart;
