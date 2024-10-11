/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-nested-ternary */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { nanoid } from 'nanoid';
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
import { Typography } from '@strapi/design-system/Typography';
import ArrowUp from '@strapi/icons/ArrowUp';
import ArrowDown from '@strapi/icons/ArrowDown';
import { Icon } from '@strapi/design-system/Icon';
import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';

import determineType from '../../utils/determineType';
import KpiChartSegment from './KpiChartSegment';
import { Colors } from '../../utils/colors';
import strapifyChartData from '../../utils/strapifyChartData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler
);

function BarChart(props) {
  const {
    chart, redraw, redrawComplete, height, editMode,
  } = props;

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw, redrawComplete]);

  const _getKpi = (data) => {
    if (data && Array.isArray(data)) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i]
          && determineType(data[i]) === 'string'
          && determineType(data[i]) === 'number'
          && determineType(data[i]) === 'boolean'
        ) {
          return data[i];
        }
      }

      return `${data[data.length - 1]}`;
    }

    return `${data}`;
  };

  const _renderGrowth = (c) => {
    if (!c) return (<span />);
    const { status, comparison } = c;
    
    return (
      <div style={{
        display: 'block',
        marginTop: chart.chartSize === 1 ? 10 : 0,
        textAlign: 'center',
      }}>
        {status === 'positive' && <Icon as={ArrowUp} height="0.7rem" color="success500" />}
        {status === 'negative' && <Icon as={ArrowDown} height="0.7rem" color="danger500" />}
        <Typography variant="omega" style={{ color: Colors[status] }}>
          {`${comparison}% `}
        </Typography>
        <Typography variant="pi" style={{ color: Colors.neutral, display: 'inline-block' }}>
          {` last ${chart.timeInterval}`}
        </Typography>
      </div>
    );
  };

  return (
    <>
      {chart.mode === 'kpi'
        && chart.chartData
        && chart.chartData.data
        && chart.chartData.data.datasets && (
        <Stack horizontal={chart.chartSize !== 1}>
          {chart.chartData.data.datasets.map((dataset, index) => (
            <Box key={dataset.id} padding={4} style={{ textAlign: 'center' }}>
              <Typography
                variant="alpha"
                style={styles.kpiItem(
                  chart.chartSize,
                  chart.chartData.data.datasets.length,
                  index,
                  !!chart.chartData.growth,
                )}
                key={nanoid()}
              >
                {dataset.data && _getKpi(dataset.data)}
              </Typography>
              {chart.Datasets[index] && (
                <Box paddingTop={chart.showGrowth ? -5 : 0 } style={{ textAlign: 'center' }}>
                  {chart.showGrowth && chart.chartData.growth && (
                    _renderGrowth(chart.chartData.growth[index])
                  )}
                  <Typography
                    variant="epsilon"
                    style={
                      chart.Datasets
                        && styles.datasetLabelColor(chart.Datasets[index].datasetColor)
                    }
                  >
                    {dataset.label}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      )}
      <div style={{ height: "100%", paddingBottom: 10 }}>
        {chart.chartData && chart.chartData.growth && chart.mode === 'kpichart' && (
          <KpiChartSegment chart={chart} editMode={editMode} />
        )}
        {chart.mode !== 'kpi' && chart.chartData && chart.chartData.data && chart.chartData.data.labels && (
          <Bar
            data={chart.chartData.data}
            options={strapifyChartData(chart.chartData).options}
            redraw={redraw}
          />
        )}
      </div>
    </>
  );
}

const styles = {
  kpiContainer: (size) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: size === 1 ? 'column' : 'row',
  }),
  kpiItem: (size, items, index) => ({
    textAlign: 'center',
    margin: 0,
    marginBottom: size === 1 && index < items - 1 ? (50 - items * 10) : 0,
    marginRight: index < items - 1 && size > 1 ? (40 * size) - (items * 8) : 0,
  }),
  datasetLabelColor: (color) => ({
    borderBottom: `solid 3px ${color}`,
  }),
};

BarChart.defaultProps = {
  redraw: false,
  redrawComplete: () => {},
  height: 300,
  editMode: false,
};

BarChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  height: PropTypes.number,
  editMode: PropTypes.bool,
};

export default BarChart;
