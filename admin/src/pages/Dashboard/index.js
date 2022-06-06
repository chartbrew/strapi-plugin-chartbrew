/* eslint-disable react-hooks/exhaustive-deps */
/*
 *
 * Dashboard page
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { LinkButton } from '@strapi/design-system/LinkButton';
import { Link } from '@strapi/design-system/Link';
import { Loader } from '@strapi/design-system/Loader';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { Combobox, ComboboxOption } from '@strapi/design-system/Combobox';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Alert } from '@strapi/design-system/Alert';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import Plus from '@strapi/icons/Plus';
import Chart from '@strapi/icons/ChartCircle';
import ExternalLink from '@strapi/icons/ExternalLink';

import pluginId from '../../pluginId';
import { getSettings, setSettings } from '../../actions/store';
import { login } from '../../actions/user';
import { getProjects, getProjectCharts } from '../../actions/project';
import { getUserTeam } from '../../actions/team';
import BarChart from '../../components/ChartbrewCharts/BarChart';
import LineChart from '../../components/ChartbrewCharts/LineChart';
import PieChart from '../../components/ChartbrewCharts/PieChart';
import RadarChart from '../../components/ChartbrewCharts/RadarChart';
import PolarChart from '../../components/ChartbrewCharts/PolarChart';
import DoughnutChart from '../../components/ChartbrewCharts/DoughnutChart';
import { Illo } from '../../components/Illo';

function Dashboard() {
  const [store, setStore] = useState({});
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [dropdownProject, setDropdownProject] = useState('');
  const [charts, setCharts] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [team, setTeam] = useState({});

  useEffect(() => {
    getSettings().then((data) => setStore(data));
    _init();
  }, []);

  useEffect(() => {
    if (store.defaultProject && projects.length > 0 && !dropdownProject) {
      // set the value for the dropdown
      const selectedProject = projects.filter((p) => p.id === store.defaultProject)[0];

      if (selectedProject) {
        setDropdownProject(`${selectedProject.name}-${selectedProject.id}`);
      }
    }
  }, [projects, store, dropdownProject]);  

  useEffect(() => {
    if (store.defaultProject) {
      setChartsLoading(true);
      getProjectCharts(store.defaultProject)
        .then((data) => {
          setCharts(data);
          setChartsLoading(false);
        })
        .catch(() => setChartsLoading(false));
    }
  }, [store]);

  const _init = () => {
    login()
      .then(async (data) => {
        setUser(data);

        const teamData = await getUserTeam(data.id);
        setTeam(teamData);
        
        return getProjects();
      })
      .then((data) => {
        setProjects(data);
        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
        setAuthError(true);
      });
  };

  const _onSelectProject = (projectValue) => {
    const project = projects.filter((p) => `${p.name}-${p.id}` === projectValue)[0];
    setDropdownProject(`${project.name}-${project.id}`);
    setSettings({ defaultProject: project.id })
      .then(() => {
        return getSettings();
      })
      .then((data) => setStore(data));

  };

  return (
    <div>
      <HeaderLayout
        title="Dashboard"
        subtitle="Visualize your Strapi data"
        primaryAction={(
          <LinkButton startIcon={<Chart />} to={`/plugins/${pluginId}/create`} disabled={!user.id}>
            Create new visualizations
          </LinkButton>
        )}
      />
      <ContentLayout>
        {pageLoading && (
          <Loader>Loading your dashboard...</Loader>
        )}

        {!pageLoading && !store.defaultProject && user.id && projects && (
          <Box padding={4} shadow="filterShadow" background="neutral0">
            <Stack spacing={1}>
              <Typography variant="beta">{'Let\'s set up your first dashboard '}</Typography>
              <Typography variant="epsilon">
                {'Select a Chartbrew dashboard to load it in Strapi '}
              </Typography>
            </Stack>
            <Box paddingTop={4}>
              <Combobox
                label="Select a Chartbrew dashboard"
                value={dropdownProject}
                onChange={_onSelectProject}
              >
                {projects.map((project) => {
                  return (
                    <ComboboxOption key={project.id} value={`${project.name}-${project.id}`}>
                      {project.name}
                    </ComboboxOption>
                  );
                })}
              </Combobox>
            </Box>
          </Box>
        )}

        {!pageLoading && !authError && user.id && projects.length === 0 && (
          <Box padding={4}>
            <EmptyStateLayout
              icon={<Illo />}
              content="It looks like you don't have a dashboard yet"
              action={(
                <LinkButton variant="secondary" startIcon={<Plus />} to={`/plugins/${pluginId}/create`}>
                  Create your first dashboard
                </LinkButton>
              )}
            />
          </Box>
        )}

        {!pageLoading && authError && (
          <Box padding={4} shadow="filterShadow" background="neutral0">
            <Box paddingTop={4}>
              <Alert
                closeLabel="Close message"
                title="Cannot authenticate to Chartbrew"
                action={(
                  <Link to={`/settings/${pluginId}`}>Click here to configure your Chartbrew connection</Link>
                )}
              >
                {'In order to access your Chartbrew dashboards, you must first set up the credentials in the settings menu. Click the link below to get started. '}
              </Alert>
            </Box>
          </Box>
        )}

        {!pageLoading && store.defaultProject && user.id && projects.length > 0 && (
          <Box padding={4}>
            <Combobox
              label="Select a Chartbrew dashboard"
              placeholder="Select a dashboard"
              value={dropdownProject}
              onChange={_onSelectProject}
              loading={chartsLoading}
              loadingMessage="Fetching the charts..."
            >
              {projects.map((project) => {
                return (
                  <ComboboxOption key={project.id} value={`${project.name}-${project.id}`}>
                    {project.name}
                  </ComboboxOption>
                );
              })}
            </Combobox>

            <Box paddingTop={4}>
              <Stack horizontal spacing={1}>
                {team && (
                  <LinkButton
                    href={`${store.clientHost}/${team.id}/${store.defaultProject}/dashboard`}
                    variant="tertiary"
                    target="_blank"
                    rel="noopener"
                    endIcon={<ExternalLink />}
                  >
                    Edit dashboard in Chartbrew
                  </LinkButton>
                )}
                <LinkButton
                  href="https://chartbrew.com/blog/create-your-strapi-visualization-dashboard-with-chartbrew?utm_source=strapi_plugin"
                  variant="tertiary"
                  target="_blank"
                  rel="noopener"
                  endIcon={<ExternalLink />}
                >
                  How to use Chartbrew with Strapi
                </LinkButton>
              </Stack>
            </Box>

            <Box paddingTop={4}>
              <Grid
                gap={[3, 2, 2]}
              >
                {charts.filter((c) => c.type !== 'table').length === 0 && (
                  <GridItem col={12}>
                    <Typography variant="epsilon">
                      <i>This dashboard does not have any charts yet.</i>
                    </Typography>
                  </GridItem>
                )}
                {charts.filter((c) => c.type !== 'table').map((chart) => (
                  <GridItem
                    key={chart.id}
                    padding={4}
                    hasRadius
                    background="neutral0"
                    shadow="tableShadow"
                    col={(12 - (12 / chart.chartSize)) || 3}
                    s={12}
                    style={{ height: 320 }}
                  >
                    <Typography>{chart.name}</Typography>
                    {chart.chartData && chart.type === 'line' && (
                      <LineChart chart={chart} />
                    )}
                    {chart.type === 'bar' && (
                      <BarChart
                        chart={chart}
                      />
                    )}
                    {chart.type === 'pie' && (
                      <PieChart chart={chart} />
                    )}
                    {chart.type === 'radar' && (
                      <RadarChart chart={chart} />
                    )}
                    {chart.type === 'doughnut' && (
                      <DoughnutChart chart={chart} />
                    )}
                    {chart.type === 'polar' && (
                      <PolarChart chart={chart} />
                    )}
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </ContentLayout>
    </div>
  );
}

export default memo(Dashboard);
