import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PolarArea } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import strapifyChartData from '../../utils/strapifyChartData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

function PolarChart(props) {
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
        <PolarArea
          data={chart.chartData.data}
          options={strapifyChartData(chart.chartData).options}
          redraw={redraw}
        />
      )}
    </div>
  );
}

PolarChart.defaultProps = {
  redraw: false,
  redrawComplete: () => { },
  height: 300,
};

PolarChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  height: PropTypes.number,
};

export default PolarChart;
