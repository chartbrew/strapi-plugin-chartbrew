import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';

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
import strapifyChartData from '../../utils/strapifyChartData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, ArcElement, Title, Tooltip, Legend, Filler,
);

const dataLabelsPlugin = {
  font: {
    weight: 'bold',
    size: 12,
    family: '--apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Oxygen,Ubuntu,Cantarell,\'Open Sans\',\'Helvetica Neue\',sans-serif',
  },
  padding: 4,
  formatter: (value, context) => {
    const hiddens = context.chart._hiddenIndices;
    let total = 0;
    const datapoints = context.dataset.data;
    datapoints.forEach((val, i) => {
      if (hiddens[i] !== undefined) {
        if (!hiddens[i]) {
          total += val;
        }
      } else {
        total += val;
      }
    });
    const percentage = `${((value / total) * 100).toFixed(2)}%`;
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
  borderColor: 'white',
  borderRadius: 6,
  borderWidth: 2,
};

function DoughnutChart(props) {
  const {
    chart, redraw, redrawComplete,
  } = props;

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw, redrawComplete]);

  return (
    <div style={{ height: "95%", paddingBottom: 10 }}>
      {chart.chartData.data && chart.chartData.data.labels && (
        <Doughnut
          data={chart.chartData.data}
          options={{
            ...strapifyChartData(chart.chartData).options,
            plugins: {
              ...strapifyChartData(chart.chartData).options.plugins,
              datalabels: dataLabelsPlugin,
            },
          }}
          redraw={redraw}
          plugins={[ChartDataLabels]}
        />
      )}
    </div>
  );
}

DoughnutChart.defaultProps = {
  redraw: false,
  redrawComplete: () => { },
  height: 280,
};

DoughnutChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  height: PropTypes.number,
};

export default DoughnutChart;
