import React from 'react';
import PropTypes from 'prop-types';
import { ArrowUp, ArrowDown } from '@strapi/icons';
import { Box, Flex, Typography, Badge } from '@strapi/design-system';

import { Colors } from '../../utils/colors';

function KpiChartSegment(props) {
  const { chart, editMode } = props;

  return (
    <Flex gap={2} style={styles.growthContainer}>
      {chart.chartData.growth.map((c, index) => {
        if (chart.chartSize === 1 && index > 1) return (<span key={c.label} />);

        if (editMode && index > 3) return (<span key={c.label} />);

        if (chart.chartSize === 2 && index > 3) return (<span key={c.label} />);

        if (chart.chartSize === 3 && index > 5) return (<span key={c.label} />);

        if (chart.chartSize > 3 && index > 7) return (<span key={c.label} />);

        return (
          <Box
            key={c.label}
            paddingRight={16 - (chart.chartData.growth.length * 2)}
          >
            <Box>
              <Typography variant="beta">{`${c.value} `}</Typography>
              {chart.showGrowth && (
                <Flex style={{ display: 'inline-block' }} alignItems="center">
                  <Badge backgroundColor={c.status === 'positive' ? 'success100' : 'danger100'} textColor={c.status === 'positive' ? 'success600' : 'danger600'}>
                    {`${c.comparison}%`}
                  </Badge>
                </Flex>
              )}
            </Box>
            <Box style={chart.chartSize === 1 ? { fontSize: '0.8em' } : {}}>
              <Typography
                variant="omega"
                style={
                  chart.Datasets
                  && styles.datasetLabelColor(chart.Datasets[index].datasetColor)
                }
              >
                {c.label}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Flex>
  );
}

const styles = {
  growthContainer: {
    boxShadow: 'none', border: 'none', marginTop: 0, marginBottom: 10
  },
  datasetLabelColor: (color) => ({
    borderBottom: `solid 3px ${color}`,
  }),
};

KpiChartSegment.propTypes = {
  chart: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired,
};

export default KpiChartSegment;
