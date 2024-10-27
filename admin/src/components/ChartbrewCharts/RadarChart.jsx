import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Radar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from 'styled-components';

import strapifyChartData from '../../utils/strapifyChartData';

ChartJS.register(
  CategoryScale, RadialLinearScale, PointElement, ArcElement, Title, Tooltip, Legend, Filler,
);

function RadarChart(props) {
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
    // add any dynamic changes to the chartJS options here
    const chartOptions = chart?.chartData?.options;
    if (chartOptions) {
      const newOptions = JSON.parse(JSON.stringify(chartOptions));

      if (newOptions.scales) {
        newOptions.scales = {
          r: {
            grid: {
              color: colors.neutral400,
            },
            angleLines: {
              color: colors.neutral400,
            },
            pointLabels: {
              color: colors.neutral800,
            },
          }
        };
      }
      if (newOptions.plugins?.legend?.labels) {
        newOptions.plugins.legend.labels.color = colors.neutral800;
      }

      return newOptions;
    }

    return chart.chartData?.options;
  };

  return (
    <div style={{ height: "100%", width: '100%', display: 'flex', flexDirection: 'column' }}>
      {chart.chartData.data && chart.chartData.data.labels && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <Radar
            data={chart.chartData.data}
            options={_getChartOptions()}
            redraw={redraw}
          />
        </div>
      )}
    </div>
  );
}

RadarChart.defaultProps = {
  redraw: false,
  redrawComplete: () => { },
};

RadarChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
};

export default RadarChart;
