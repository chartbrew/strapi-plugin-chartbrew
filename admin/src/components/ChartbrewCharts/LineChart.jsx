/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-nested-ternary */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
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


import KpiChartSegment from './KpiChartSegment';
import strapifyChartData from '../../utils/strapifyChartData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

function LineChart(props) {
  const {
    chart, redraw, redrawComplete, editMode,
  } = props; 

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw, redrawComplete]);

  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: chart.mode === "kpichart" ? "83%" : "100%", paddingBottom: 10 }}>
        {chart.chartData.growth && chart.mode === 'kpichart' && (
          <KpiChartSegment chart={chart} editMode={editMode} />
        )}
        {chart.chartData.data && chart.chartData.data.labels && (
          <div style={{ height: "100%" }}>
            <Line
              data={chart.chartData.data}
              options={strapifyChartData(chart.chartData).options}
              redraw={redraw}
            />
          </div>
        )}
      </div>
    </div>
  );
}

LineChart.defaultProps = {
  redraw: false,
  redrawComplete: () => {},
  height: 300,
  editMode: false,
};

LineChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  height: PropTypes.number,
  editMode: PropTypes.bool,
};

export default LineChart;
