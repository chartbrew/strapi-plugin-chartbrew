/**
 *
 * This is the page where users create new dashboards and charts
 *
 */

import React, { useState, useEffect } from 'react';
import {
  Typography, Button, Grid, Divider, Alert, SingleSelect,
  SingleSelectOption, Combobox, ComboboxOption, Checkbox, Box, Link,
} from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { Layouts } from '@strapi/strapi/admin';

import { PLUGIN_ID } from '../pluginId';
import { getModels } from '../actions/model';
import { getSettings, setSettings } from '../actions/store';
import { generateTemplate } from '../actions/project';
import { getStrapiTemplate, getTeamConnections, getUserTeam } from '../actions/team';
import { login } from '../actions/user';

function Create() {
  const [collection, setCollection] = useState({});
  const [models, setModels] = useState([]);
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [projects, setProjects] = useState([]);
  const [templateCharts, setTemplateCharts] = useState([]);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [dropdownProject, setDropdownProject] = useState('');
  const [generating, setGenerating] = useState(false);
  const [userTeam, setUserTeam] = useState({});
  const [planLimits, setPlanLimits] = useState(false);
  const [store, setStore] = useState({});
  const [generationError, setGenerationError] = useState(false);
  const [teams, setTeams] = useState([]);
  const [dropdownTeam, setDropdownTeam] = useState('');

  useEffect(async () => {
    getSettings()
      .then((data) => {
        setSettingsLoading(false);
        setHasToken(data.hasToken);
        setStore(data);
      })
      .catch(() => setSettingsLoading(false));

    getModels()
      .then((data) => {
        setModels(data);
      });

    const user = await login();
    const teamData = await getUserTeam(user.id);
    setTeams(teamData);

    const template = await getStrapiTemplate(teamData[0].id);
    const charts = template.Charts.map((c) => ({
      tid: c.tid,
      name: c.name,
    }));

    setTemplateCharts(charts);
    setSelectedCharts(charts.map((c) => c.tid));
  }, []);

  const _onSelectCollection = (model) => {
    setCollection(model);

    // try and auto-select the timestamp fields
    if (model.attributes.createdAt) setCreatedAt('createdAt');
    else if (model.attributes.created_at) setCreatedAt('created_at');

    if (model.attributes.updatedAt) setUpdatedAt('updatedAt');
    else if (model.attributes.updated_at) setUpdatedAt('updated_at');
  };

  const _onToggleChart = (chart) => {
    let foundIndex;
    selectedCharts.forEach((c, index) => {
      if (c === chart.tid) foundIndex = index;
    });

    let newSelectedCharts = [...selectedCharts];

    if (foundIndex || foundIndex === 0) newSelectedCharts.splice(foundIndex, 1);
    else newSelectedCharts.push(chart.tid);

    setSelectedCharts(newSelectedCharts);
  };

  const _onSelectProject = (projectValue) => {
    if (!projectValue) return;
    const project = projects.filter((p) => `${p.name}-${p.id}` === projectValue)[0];
    setDropdownProject(`${project.name}-${project.id}`);
    setSelectedProject(project);
  };

  const _onGenerateCharts = async () => {
    const data = {
      createdField: createdAt,
      updatedField: updatedAt,
      collection: collection.pluralName,
      projectId: selectedProject.id,
      charts: selectedCharts,
      teamId: userTeam.id,
    };

    if (selectedProject && selectedProject.id) {
      const connections = await getTeamConnections(userTeam.id);
      const strapiConnection = connections.filter((c) => {
        return c.host && c.host.indexOf(store.strapiHost) > -1;
      })[0];

      if (strapiConnection && strapiConnection.id) {
        data.connections_id = strapiConnection.id;
      }
    }

    setGenerating(true);
    generateTemplate(data)
      .then((project) => {
        return setSettings({ defaultProject: project.id });
      })
      .then(() => {
        setTimeout(() => {
          location.pathname = `/admin/plugins/${PLUGIN_ID}`;
          setGenerating(false);
        }, 1000);
      })
      .catch((err) => {
        if (err && err.message && err.message.indexOf("406") > -1) {
          setPlanLimits(true);
        } else {
          setGenerationError(true);
        }
        setGenerating(false);
      });
  };

  const _isLocalConnectingToManaged = () => {
    if (store.strapiHost
      && store.strapiHost.indexOf("http://localhost") > -1
      && store.host.indexOf("https://api.chartbrew.com") > -1
    ) {
      return true;
    }

    return false;
  }

  const _onSelectTeam = (teamValue) => {
    if (!teamValue) return;
    const team = teams.find((t) => `${t.name}-${t.id}` === teamValue);
    setDropdownTeam(`${team.name}-${team.id}`);
    setUserTeam(team);

    setProjects(team.Projects);
  };

  return (
    <div>
      <Layouts.Header
        title="Create"
        subtitle="Add new visualizations to your Chartbrew dashboards"
        navigationAction={(
          <Link startIcon={<ArrowLeft />} to={`/plugins/${PLUGIN_ID}`}>
            Back to the dashboard
          </Link>
        )}
      />
      <Layouts.Content>
        <Box padding={6} shadow="filterShadow" background="neutral0">
          {!settingsLoading && store.strapiHost && _isLocalConnectingToManaged() && (
            <Box paddingBottom={4}>
              <Alert
                closeLabel="Close alert"
                title="Chartbrew might not be able to create charts"
                variant="danger"
                action={(<Link to={`/settings/${PLUGIN_ID}`}>Click here to go to settings</Link>)}
                onClose={() => { }}
              >
                {"It looks like your Strapi Backend URL is on localhost. Chartbrew's server will not be able to access your localhost environment. Please update your Strapi Backend URL to something like https://my-strapi-backend.com or self-host Chartbrew on the same server as your Strapi Backend."}
              </Alert>
            </Box>
          )}
          {!settingsLoading && !hasToken && (
            <Box paddingBottom={4}>
              <Alert
                closeLabel="Close alert"
                title="Chartbrew cannot create charts from your Strapi data"
                variant="danger"
                action={(<Link to={`/settings/${PLUGIN_ID}`}>Click here to go to settings</Link>)}
                onClose={() => { }}
              >
                {'In order to allow Chartbrew to create visualizations for you, please add a Strapi API token in the settings. '}
              </Alert>
            </Box>
          )}
          {!settingsLoading && !store.strapiHost && (
            <Box paddingBottom={4}>
              <Alert
                closeLabel="Close alert"
                title="Chartbrew cannot create charts from your Strapi data"
                variant="danger"
                action={(<Link to={`/settings/${PLUGIN_ID}`}>Click here to go to settings</Link>)}
                onClose={() => { }}
              >
                {'Your Strapi backend URL is missing from the Chartbrew settings. Set it up by going to the settings page. '}
              </Alert>
            </Box>
          )}
          <Box>
            <Typography variant="delta">{'Select your Chartbrew team'}</Typography>
          </Box>
          <Box paddingTop={2}>
            <SingleSelect
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
          {dropdownTeam && (
            <>
              <Box paddingTop={4}>
                <Typography variant="delta">{'Select one of your collection types below '}</Typography>
              </Box>
              <Box paddingTop={4}>
                <Grid gap={[3, 2, 2]}>
                  {models.map((model) => (
                    <Grid.Item key={model.uid} col={2} s={4} xs={6}>
                      <Button
                        variant={model.uid === collection.uid ? 'default' : 'secondary'}
                        onClick={() => _onSelectCollection(model)}
                        fullWidth
                      >
                        {model.displayName}
                      </Button>
                    </Grid.Item>
                  ))}
                </Grid>
              </Box>
            </>
          )}

          {collection.uid && (
            <Box>
              <Box paddingTop={6} paddingBottom={6}>
                <Divider />
              </Box>

              <Box>
                <Typography variant="delta">{'Timestamp settings '}</Typography>
              </Box>
              <Box paddingTop={2}>
                <Flex gap={2}>
                  <Combobox
                    label="Select your 'created at' field"
                    value={createdAt}
                    onChange={(value) => setCreatedAt(value)}
                  >
                    {Object.keys(collection.attributes)?.map((attribute) => {
                      return (
                        <ComboboxOption key={attribute} value={attribute}>
                          {attribute}
                        </ComboboxOption>
                      );
                    })}
                  </Combobox>
                  <Combobox
                    label="Select your 'updated at' field"
                    value={updatedAt}
                    onChange={(value) => setUpdatedAt(value)}
                  >
                    {Object.keys(collection.attributes)?.map((attribute) => {
                      return (
                        <ComboboxOption key={attribute} value={attribute}>
                          {attribute}
                        </ComboboxOption>
                      );
                    })}
                  </Combobox>
                </Flex>
              </Box>

              <Box paddingTop={6}>
                <Typography variant="delta">{'Select the charts you want to create '}</Typography>
                <Box>
                  <Typography textColor="neutral600">{'(More will be added later) '}</Typography>
                </Box>
              </Box>
              <Box paddingTop={4}>
                <Grid gap={[4, 4, 4]}>
                  {templateCharts.map((chart) => (
                    <Grid.Item col={3} s={4} xs={6} key={chart.tid}>
                      <Checkbox
                        checked={selectedCharts.indexOf(chart.tid) > -1}
                        onClick={() => _onToggleChart(chart)}
                      >
                        {chart.name && chart.name.replace('undefined', collection.pluralName)}
                      </Checkbox>
                    </Grid.Item>
                  ))}
                </Grid>
              </Box>

              <Box paddingTop={6} paddingBottom={6}>
                <Divider />
              </Box>

              <Box>
                <Typography variant="delta">{'Choose a dashboard where to place the charts '}</Typography>
                <Box>
                  <Typography textColor="neutral600">{'Or leave empty to create a new dashboard '}</Typography>
                </Box>
              </Box>
              <Box paddingTop={2}>
                <Combobox
                  aria-label="Select a Chartbrew dashboard"
                  placeholder="Select a dashboard or leave empty"
                  value={dropdownProject}
                  onChange={_onSelectProject}
                >
                  {projects.filter((p) => p).map((p) => {
                    return (
                      <ComboboxOption key={p.id} value={`${p.name}-${p.id}`}>
                        {p.name}
                      </ComboboxOption>
                    );
                  })}
                </Combobox>
              </Box>

              <Box paddingTop={6}>
                <Button
                  onClick={() => _onGenerateCharts()}
                  size="L"
                  loading={generating}
                  disabled={selectedCharts.length < 1 || !dropdownTeam}
                  variant={planLimits ? "danger" : "default"}
                >
                  Create the charts
                </Button>
              </Box>

              {generationError && (
                <Box paddingTop={4}>
                  <Alert
                    closeLabel="Close alert"
                    title="The charts could not be created"
                    variant="danger"
                    action={(<Link to={`/settings/${PLUGIN_ID}`}>Click here to go to settings</Link>)}
                    onClose={() => setGenerationError(false)}
                  >
                    {'There was an error generating your charts. Please make sure all your settings are correct and try again.'}
                  </Alert>
                </Box>
              )}

              {planLimits && (
                <Box paddingTop={4}>
                  <Alert
                    closeLabel="Close alert"
                    title="You reached the limits of your Chartbrew plan"
                    variant="danger"
                    action={(<Link href={`${store.clientHost}/manage/${userTeam.id}/plans`}>Click here to go to your Chartbrew accounts settings</Link>)}
                    onClose={() => setPlanLimits(false)}
                  >
                    {'Your plan does not allow to create more charts in this project, or to create new projects. Please update your Chartbrew subscription to add more charts. '}
                  </Alert>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Layouts.Content>
    </div>
  );
}

export { Create };
