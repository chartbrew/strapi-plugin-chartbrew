// change the chart configuration to make sure it appears nicely in Strapi
export default function strapifyChartData(chartData) {
  const strapiChartData = chartData;
  const family = '--apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Oxygen,Ubuntu,Cantarell,\'Open Sans\',\'Helvetica Neue\',sans-serif';

  if (strapiChartData.options
    && strapiChartData.options.scales
    && strapiChartData.options.scales.x
    && strapiChartData.options.scales.x.ticks
  ) {
    strapiChartData.options.scales.x.ticks = {
      ...strapiChartData.options.scales.x.ticks,
      font: {
        ...strapiChartData.options.scales.x.ticks.font,
        family,
      },
    };
  }

  if (strapiChartData.options
    && strapiChartData.options.scales
    && strapiChartData.options.scales.y
    && strapiChartData.options.scales.y.ticks
  ) {
    strapiChartData.options.scales.y.ticks = {
      ...strapiChartData.options.scales.y.ticks,
      font: {
        ...strapiChartData.options.scales.y.ticks.font,
        family,
      },
    };
  }

  if (strapiChartData.options
    && strapiChartData.options.plugins
    && strapiChartData.options.plugins.legend
    && strapiChartData.options.plugins.legend.labels
  ) {
    strapiChartData.options.plugins.legend.labels.font = {
      ...strapiChartData.options.plugins.legend.labels.font,
      family,
    };
  }

  if (strapiChartData.options
    && strapiChartData.options.plugins
    && strapiChartData.options.plugins.tooltip
  ) {
    strapiChartData.options.plugins.tooltip = {
      ...strapiChartData.options.plugins.tooltip,
      titleFont: {
        ...strapiChartData.options.plugins.tooltip.titleFont,
        family,
      },
      bodyFont: {
        ...strapiChartData.options.plugins.tooltip.bodyFont,
        family,
      },
    };
  }

  return strapiChartData;
};
