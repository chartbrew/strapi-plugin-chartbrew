import React from 'react'
import { Box, Typography, Badge } from '@strapi/design-system';
import { nanoid } from 'nanoid';

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
        <Badge backgroundColor={c.status === 'positive' ? 'success100' : 'danger100'} textColor={c.status === 'positive' ? 'success600' : 'danger600'} size="S">
          {`${c.comparison}%`}
        </Badge>
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
          {chart.ChartDatasetConfigs[index] && (
            <Box paddingTop={chart.showGrowth ? -5 : 0} style={{ textAlign: 'center' }}>
              <Typography
                variant="epsilon"
              >
                {dataset.label}
              </Typography>
            </Box>
          )}

          <Typography
            variant="alpha"
            key={nanoid()}
          >
            {dataset.data && _getKpi(dataset.data)}
          </Typography>

          {chart.showGrowth && chart.chartData.growth && (
            _renderGrowth(chart.chartData.growth[index])
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
