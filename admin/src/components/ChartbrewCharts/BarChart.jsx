/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-nested-ternary */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from 'styled-components';

import determineType from '../../utils/determineType';
import KpiChartSegment from './KpiChartSegment';
import { Colors } from '../../utils/colors';
import strapifyChartData from '../../utils/strapifyChartData';
import { getHeightBreakpoint, getWidthBreakpoint } from '../../utils/layoutBreakpoints';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler
);

function BarChart(props) {
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

      if (newOptions?.scales?.x?.ticks && newOptions?.scales?.y?.ticks) {
        // sizing changes
        const widthBreakpoint = chart.horizontal ? getHeightBreakpoint(chartRef) : getWidthBreakpoint(chartRef);
        const heightBreakpoint = chart.horizontal ? getWidthBreakpoint(chartRef) : getHeightBreakpoint(chartRef);

        if (widthBreakpoint === "xxs" || widthBreakpoint === "xs") {
          newOptions.elements.point.radius = 0;
        } else {
          newOptions.elements.point.radius = chartOptions.elements?.point?.radius;
        }

        const realX = chart.horizontal ? "y" : "x";
        const realY = chart.horizontal ? "x" : "y";

        if (widthBreakpoint === "xxs" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 4;
          newOptions.scales[realX].ticks.maxRotation = 25;
        } else if (widthBreakpoint === "xs" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 6;
          newOptions.scales[realX].ticks.maxRotation = 25;
        } else if (widthBreakpoint === "sm" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 8;
          newOptions.scales[realX].ticks.maxRotation = 25;
        } else if (widthBreakpoint === "md" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 12;
          newOptions.scales[realX].ticks.maxRotation = 90;
        } else if (!chart.xLabelTicks) {
          newOptions.scales[realX].ticks.maxTicksLimit = 16;
        }

        if (heightBreakpoint === "xs") {
          newOptions.scales[realY].ticks.maxTicksLimit = 4;
        } else {
          newOptions.scales[realY].ticks.maxTicksLimit = 10;
        }
      }

      return newOptions;
    }

    return chartOptions;
  };

  const _getDatalabelsOptions = () => {
    return {
      font: {
        weight: "bold",
        size: 10,
        family: "Inter",
        color: "white"
      },
      padding: 4,
      borderRadius: 4,
      formatter: Math.round,
    };
  };

  const _getChartData = () => {
    if (!chart?.chartData?.data?.datasets) return chart.chartData.data;

    const newChartData = JSON.parse(JSON.stringify(chart.chartData.data));

    newChartData?.datasets?.forEach((dataset, index) => {
      if (dataset?.datalabels && index === chart.chartData.data.datasets.length - 1) {
        newChartData.datasets[index].datalabels.color = colors.neutral800;
      }
    });

    return newChartData;
  };

  return (
    <>
      <div style={{ height: "100%", width: '100%', display: 'flex', flexDirection: 'column' }} ref={chartRef}>
        {chart.chartData && chart.chartData.growth && chart.mode === 'kpichart' && (
          <KpiChartSegment chart={chart} editMode={editMode} />
        )}
        {chart.chartData && chart.chartData.data && chart.chartData.data.labels && (
          <div style={{ flex: 1, minHeight: 0 }}>
            <Bar
              data={_getChartData()}
              options={{
                ..._getChartOptions(),
                plugins: {
                  ..._getChartOptions().plugins,
                  datalabels: chart.dataLabels && _getDatalabelsOptions(),
                },
                maintainAspectRatio: false,
                responsive: true,
              }}
              redraw={redraw}
              plugins={chart.dataLabels ? [ChartDataLabels] : []}
            />
          </div>
        )}
      </div>
    </>
  );
}

BarChart.defaultProps = {
  redraw: false,
  redrawComplete: () => {},
  editMode: false,
};

BarChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  editMode: PropTypes.bool,
};

export default BarChart;
