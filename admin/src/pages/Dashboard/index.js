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
import { Flex } from '@strapi/design-system/Flex';
import { LinkButton } from '@strapi/design-system/LinkButton';
import { Link } from '@strapi/design-system/Link';
import { Loader } from '@strapi/design-system/Loader';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { Combobox, ComboboxOption } from '@strapi/design-system/Combobox';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system/Select';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Alert } from '@strapi/design-system/Alert';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import Plus from '@strapi/icons/Plus';
import Chart from '@strapi/icons/ChartCircle';
import ExternalLink from '@strapi/icons/ExternalLink';
import { WidthProvider, Responsive } from "react-grid-layout";

import pluginId from '../../pluginId';
import { getSettings, setSettings } from '../../actions/store';
import { login } from '../../actions/user';
import { getProjectCharts } from '../../actions/project';
import { getUserTeam } from '../../actions/team';
import BarChart from '../../components/ChartbrewCharts/BarChart';
import LineChart from '../../components/ChartbrewCharts/LineChart';
import PieChart from '../../components/ChartbrewCharts/PieChart';
import RadarChart from '../../components/ChartbrewCharts/RadarChart';
import PolarChart from '../../components/ChartbrewCharts/PolarChart';
import DoughnutChart from '../../components/ChartbrewCharts/DoughnutChart';
import { Illo } from '../../components/Illo';
import KpiChart from '../../components/ChartbrewCharts/KpiChart';

const ResponsiveGridLayout = WidthProvider(Responsive, { measureBeforeMount: true });

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
  const [teams, setTeams] = useState([]);
  const [dropdownTeam, setDropdownTeam] = useState('');
  const [layouts, setLayouts] = useState(null);

  useEffect(() => {
    getSettings().then((data) => setStore(data));
    _init();
  }, []);

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

  useEffect(() => {
    if (store.defaultTeam && teams.length > 0 && !dropdownTeam) {
      // set the value for the dropdown
      const selectedTeam = teams.find((t) => t.id === store.defaultTeam);
      setProjects(selectedTeam.Projects);

      if (selectedTeam) {
        setDropdownTeam(`${selectedTeam.name}-${selectedTeam.id}`);

        if (store.defaultProject) {
          const selectedProject = selectedTeam.Projects.find((p) => p.id === store.defaultProject);

          if (selectedProject) {
            setDropdownProject(`${selectedProject.name}-${selectedProject.id}`);
          }
        }
      }
    }
  }, [teams, store, dropdownTeam]);

  useEffect(() => {
    if (charts && charts.length > 0) {
      // set the grid layout
      const newLayouts = { xxs: [], xs: [], sm: [], md: [], lg: [] };
      charts.forEach((chart) => {
        if (chart.layout) {
          Object.keys(chart.layout).forEach((key) => {
            newLayouts[key].push({
              i: chart.id.toString(),
              x: chart.layout[key][0] || 0,
              y: chart.layout[key][1] || 0,
              w: chart.layout[key][2],
              h: chart.layout[key][3],
              minW: 2,
            });
          });
        }
      });

      setLayouts(newLayouts);
    }
  }, [charts]);

  const _init = () => {
    login()
      .then(async (data) => {
        setUser(data);

        const teamData = await getUserTeam(data.id);
        setTeams(teamData);
        setTeam(teamData[0]);

        setProjects(teamData[0]?.Projects || []);

        setPageLoading(false);
      })
      .catch(() => {
        setPageLoading(false);
        setAuthError(true);
      });
  };

  const _onSelectProject = (projectValue) => {
    if (!projectValue) return;
    const project = projects.filter((p) => `${p.name}-${p.id}` === projectValue)[0];
    setDropdownProject(`${project.name}-${project.id}`);
    setSettings({ defaultProject: project.id })
      .then(() => {
        return getSettings();
      })
      .then((data) => setStore(data));

  };

  const _onSelectTeam = (teamValue) => {
    if (!teamValue) return;
    const selectedTeam = teams.filter((t) => `${t.name}-${t.id}` === teamValue)[0];
    setTeam(selectedTeam);
    setDropdownTeam(`${selectedTeam.name}-${selectedTeam.id}`);
    setDropdownProject('');
    setProjects(selectedTeam.Projects);
    setSettings({ defaultTeam: selectedTeam.id })
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

        {!pageLoading && !store.defaultTeam && user.id && teams && (
          <Box padding={4} shadow="filterShadow" background="neutral0">
            <Stack spacing={1}>
              <Typography variant="beta">{'Let\'s set up your first dashboard '}</Typography>
              <Typography variant="epsilon">
                {'Select a Chartbrew dashboard to load it in Strapi '}
              </Typography>
            </Stack>
            <Flex paddingTop={4}>
              <SingleSelect
                label="Select a Chartbrew team"
                value={dropdownTeam}
                onChange={_onSelectTeam}
              >
                {teams.map((t) => {
                  return (
                    <SingleSelectOption key={t.id} value={`${t.name}-${t.id}`}>
                      {t.name}
                    </SingleSelectOption>
                  );
                })}
              </SingleSelect>

              <Combobox
                label="Select a Chartbrew dashboardd"
                value={dropdownProject}
                onChange={_onSelectProject}
              >
                {projects.map((p) => {
                  return (
                    <ComboboxOption key={p.id} value={`${p.name}-${p.id}`}>
                      {p.name}
                    </ComboboxOption>
                  );
                })}
              </Combobox>
            </Flex>
          </Box>
        )}

        {!pageLoading && !authError && user.id && team && projects.length === 0 && (
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

        {!pageLoading && store.defaultTeam && user.id && projects.length > 0 && (
          <Box>
            <Flex>
              <Box paddingRight={4}>
                <SingleSelect
                  label="Select a Chartbrew team"
                  value={dropdownTeam}
                  onChange={_onSelectTeam}
                >
                  {teams.map((t) => {
                    return (
                      <SingleSelectOption key={t.id} value={`${t.name}-${t.id}`}>
                        {t.name}
                      </SingleSelectOption>
                    );
                  })}
                </SingleSelect>
              </Box>
              <Box>
                <Combobox
                  label="Select a Chartbrew dashboard"
                  placeholder="Select a dashboard"
                  value={dropdownProject}
                  onChange={_onSelectProject}
                  loading={chartsLoading}
                  loadingMessage="Fetching the charts..."
                >
                  {projects.map((p) => {
                    return (
                      <ComboboxOption key={p.id} value={`${p.name}-${p.id}`}>
                        {p.name}
                      </ComboboxOption>
                    );
                  })}
                </Combobox>
              </Box>
            </Flex>

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
              <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                margin={{ lg: [12, 12], md: [12, 12], sm: [12, 12], xs: [12, 12], xxs: [12, 12] }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
                rowHeight={150}
                isDraggable={false}
                isResizable={false}
              >
                {charts.map((chart, index) => (
                  <Box
                    key={chart.id}
                    background="neutral0"
                    padding={4}
                    hasRadius
                    shadow="tableShadow"
                  >
                    <Typography variant="delta">{chart.name}</Typography>
                    {chart.chartData && chart.type === 'line' && (
                      <LineChart chart={chart} />
                    )}
                    {chart.type === 'bar' && (
                      <BarChart chart={chart} />
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
                    {chart.type === 'avg' && (
                      <LineChart chart={chart} />
                    )}
                    {chart.type === 'kpi' && (
                      <KpiChart chart={chart} />
                    )}
                  </Box>
                ))}
              </ResponsiveGridLayout>
            </Box>
          </Box>
        )}
      </ContentLayout>
    </div>
  );
}

export default memo(Dashboard);
