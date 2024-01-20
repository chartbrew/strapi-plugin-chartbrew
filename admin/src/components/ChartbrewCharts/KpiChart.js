import React from 'react'
import { Typography } from '@strapi/design-system/Typography';
import ArrowUp from '@strapi/icons/ArrowUp';
import ArrowDown from '@strapi/icons/ArrowDown';
import { Icon } from '@strapi/design-system/Icon';
import { Box } from '@strapi/design-system/Box';
import uuid from 'uuid/v4';

import determineType from '../../utils/determineType';
import { Colors } from '../../utils/colors';

function KpiChart(props) {
  const { chart } = props;

  const _getKpi = (data) => {
    if (data && Array.isArray(data)) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i]
          && (determineType(data[i]) === 'string'
            || determineType(data[i]) === 'number'
            || determineType(data[i]) === 'boolean')
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        gap: 10,
        height: "100%",
      }}
    >
      {chart?.chartData?.data?.datasets.map((dataset, index) => (
        <Box key={dataset.id} padding={4} style={{ textAlign: 'center' }}>
          <Typography
            variant="alpha"
            key={uuid()}
          >
            {dataset.data && _getKpi(dataset.data)}
          </Typography>
          {chart.ChartDatasetConfigs[index] && (
            <Box paddingTop={chart.showGrowth ? -5 : 0} style={{ textAlign: 'center' }}>
              {chart.showGrowth && chart.chartData.growth && (
                _renderGrowth(chart.chartData.growth[index])
              )}
              <Typography
                variant="epsilon"
                style={
                  chart.ChartDatasetConfigs
                  && styles.datasetLabelColor(chart.ChartDatasetConfigs[index].datasetColor)
                }
              >
                {dataset.label}
              </Typography>
            </Box>
          )}
        </Box>
      ))}
    </div>
  )
}

const styles = {
  datasetLabelColor: (color) => ({
    borderBottom: `solid 3px ${color}`,
  }),
};

export default KpiChart
