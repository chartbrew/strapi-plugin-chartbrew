/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-nested-ternary */

import React, { useEffect, useRef } from 'react';
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
  LogarithmicScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTheme } from 'styled-components';

import { getHeightBreakpoint, getWidthBreakpoint } from '../../utils/layoutBreakpoints';
import KpiChartSegment from './KpiChartSegment';
import strapifyChartData from '../../utils/strapifyChartData';

ChartJS.register(
  CategoryScale, LinearScale, LogarithmicScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const dataLabelsPlugin = {
  font: {
    weight: "bold",
    size: 10,
    family: "Inter",
  },
  padding: 4,
  backgroundColor(context) {
    if (context.dataset.backgroundColor === "transparent"
      || context.dataset.backgroundColor === "rgba(0,0,0,0)"
    ) {
      return context.dataset.borderColor;
    }
    return context.dataset.backgroundColor;
  },
  borderRadius: 4,
  color: "white",
  formatter: Math.round,
};

function LineChart(props) {
  const {
    chart, redraw, redrawComplete, editMode,
  } = props;

  const { colors } = useTheme();
  const chartRef = useRef(null);

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw, redrawComplete]);

  const _getChartOptions = () => {
    const chartOptions = strapifyChartData(chart.chartData).options;
    // add any dynamic changes to the chartJS options here
    if (chartOptions) {
      const newOptions = JSON.parse(JSON.stringify(chartOptions));
      if (newOptions.scales?.y?.grid) {
        newOptions.scales.y.grid.color = colors.neutral300;
      }
      if (newOptions.scales?.x?.grid) {
        newOptions.scales.x.grid.color = colors.neutral300;
      }
      if (newOptions.scales?.y?.ticks) {
        newOptions.scales.y.ticks.color = colors.neutral800;
      }
      if (newOptions.scales?.x?.ticks) {
        newOptions.scales.x.ticks.color = colors.neutral800;
      }
      if (newOptions.plugins?.legend?.labels) {
        newOptions.plugins.legend.labels.color = colors.neutral800;
      }

      // sizing changes
      if (newOptions?.scales?.x?.ticks && newOptions?.scales?.y?.ticks) {
        const widthBreakpoint = getWidthBreakpoint(chartRef);
        const heightBreakpoint = getHeightBreakpoint(chartRef);

        if (widthBreakpoint === "xxs" || widthBreakpoint === "xs") {
          newOptions.elements.point.radius = 0;
        } else {
          newOptions.elements.point.radius = chartOptions.elements?.point?.radius;
        }

        if (widthBreakpoint === "xxs" && chart.xLabelTicks === "default") {
          newOptions.scales.x.ticks.maxTicksLimit = 4;
          newOptions.scales.x.ticks.maxRotation = 25;
        } else if (widthBreakpoint === "xs" && chart.xLabelTicks === "default") {
          newOptions.scales.x.ticks.maxTicksLimit = 6;
          newOptions.scales.x.ticks.maxRotation = 25;
        } else if (widthBreakpoint === "sm" && chart.xLabelTicks === "default") {
          newOptions.scales.x.ticks.maxTicksLimit = 8;
          newOptions.scales.x.ticks.maxRotation = 25;
        } else if (widthBreakpoint === "md" && chart.xLabelTicks === "default") {
          newOptions.scales.x.ticks.maxTicksLimit = 12;
          newOptions.scales.x.ticks.maxRotation = 45;
        } else if (!chart.xLabelTicks) {
          newOptions.scales.x.ticks.maxTicksLimit = 16;
        }

        if (heightBreakpoint === "xs") {
          newOptions.scales.y.ticks.maxTicksLimit = 4;
        } else {
          newOptions.scales.y.ticks.maxTicksLimit = 6;
        }
      }
      
      return newOptions;
    }

    return chartOptions;
  };

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
              options={{
                ..._getChartOptions(),
                plugins: {
                  ..._getChartOptions().plugins,
                  datalabels: chart.dataLabels && dataLabelsPlugin,
                },
              }}
              redraw={redraw}
              plugins={chart.dataLabels ? [ChartDataLabels] : []}
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
  editMode: false,
};

LineChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  editMode: PropTypes.bool,
};

export default LineChart;
