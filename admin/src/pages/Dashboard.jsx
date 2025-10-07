/* eslint-disable react-hooks/exhaustive-deps */
/*
 *
 * Dashboard page
 *
 */

import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import {
  Box, Flex, LinkButton, Link, Loader, Typography,
  SingleSelect, SingleSelectOption, Alert, EmptyStateLayout,
  Checkbox,
} from '@strapi/design-system';
import { Plus, ChartCircle, ExternalLink } from '@strapi/icons';
import { Layouts } from '@strapi/strapi/admin';
import { Link as RouterLink } from 'react-router-dom';

import { PLUGIN_ID } from '../pluginId';
import { getSettings, setSettings } from '../actions/store';
import { login } from '../actions/user';
import { getUserTeam } from '../actions/team';
import Illo from '../components/Illo';

function Dashboard() {
  const [store, setStore] = useState({});
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [dropdownProject, setDropdownProject] = useState('');
  const [authError, setAuthError] = useState(false);
  const [team, setTeam] = useState({});
  const [teams, setTeams] = useState([]);
  const [dropdownTeam, setDropdownTeam] = useState('');
  const [selectedProject, setSelectedProject] = useState({});
  const [removeHeader, setRemoveHeader] = useState(false);
  const [removeStyling, setRemoveStyling] = useState(false);

  useEffect(() => {
    getSettings().then((data) => setStore(data));
    _init();
  }, []);

  useEffect(() => {
    if (store.defaultTeam && teams.length > 0 && !dropdownTeam) {
      // set the value for the dropdown
      const selectedTeam = teams.find((t) => t.id === store.defaultTeam);

      if (selectedTeam) {
        setDropdownTeam(`${selectedTeam.name}-${selectedTeam.id}`);
        setProjects(selectedTeam.Projects);

        if (store.defaultProject) {
          const selectedProject = selectedTeam.Projects.find((p) => p.id === store.defaultProject);

          if (selectedProject) {
            setDropdownProject(`${selectedProject.name}-${selectedProject.id}`);
            setSelectedProject(selectedProject);
          }
        }
      }
    }
  }, [teams, store, dropdownTeam]);

  const _init = () => {
    login()
      .then(async (data) => {
        setUser(data);

        const teamData = await getUserTeam();
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

  const _onSelectProject = async (projectValue) => {
    if (!projectValue) return;

    const project = projects.filter((p) => `${p.name}-${p.id}` === projectValue)[0];
    setSelectedProject(project);

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
      <Layouts.Header
        title="Dashboard"
        subtitle="Visualize your Strapi data"
        primaryAction={(
          <LinkButton tag={RouterLink} startIcon={<ChartCircle />} to={`/plugins/${PLUGIN_ID}/create`} disabled={!user.id}>
            Create new visualizations
          </LinkButton>
        )}
      />
      <Layouts.Content>
        {pageLoading && (
          <Loader>Loading your dashboard...</Loader>
        )}

        {!pageLoading && !store.defaultTeam && user.id && teams && (
          <Box padding={4} shadow="filterShadow" background="neutral0">
            <Flex gap={1}>
              <Typography variant="beta">{'Let\'s set up your first dashboard '}</Typography>
              <Typography variant="epsilon">
                {'Select a Chartbrew dashboard to load it in Strapi '}
              </Typography>
            </Flex>
            <Flex paddingTop={4} gap={2}>
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

              <SingleSelect
                label="Select a Chartbrew dashboard"
                value={dropdownProject}
                onChange={_onSelectProject}
              >
                {projects.map((p) => {
                  return (
                    <SingleSelectOption key={p.id} value={`${p.name}-${p.id}`}>
                      {p.name}
                    </SingleSelectOption>
                  );
                })}
              </SingleSelect>
            </Flex>
          </Box>
        )}

        {!pageLoading && !authError && user.id && team && projects.length === 0 && (
          <Box padding={4}>
            <EmptyStateLayout
              icon={<Illo />}
              content="It looks like you don't have a dashboard yet"
              action={(
                <LinkButton variant="secondary" startIcon={<Plus />} to={`/plugins/${PLUGIN_ID}/create`}>
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
                  <div><Link to={`/settings/${PLUGIN_ID}`}>Click here to configure your Chartbrew connection</Link></div>
                )}
              >
                {'In order to access your Chartbrew dashboards, you must first set up the credentials in the settings menu. Click the link below to get started. '}
              </Alert>
            </Box>
          </Box>
        )}

        {!pageLoading && store.defaultTeam && user.id && projects.length > 0 && (
          <Box>
            <Flex wrap="wrap" gap={2}>
              <Box>
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
                <SingleSelect
                  label="Select a Chartbrew dashboard"
                  placeholder="Select a dashboard"
                  value={dropdownProject}
                  onChange={_onSelectProject}
                >
                  {projects.map((p) => {
                    return (
                      <SingleSelectOption key={p.id} value={`${p.name}-${p.id}`}>
                        {p.name}
                      </SingleSelectOption>
                    );
                  })}
                </SingleSelect>
              </Box>

              {selectedProject && (
                <>
                  <Checkbox paddingLeft={4} onCheckedChange={() => setRemoveHeader(!removeHeader)}>
                    <Typography variant="delta">Remove header</Typography>
                  </Checkbox>
                  <Checkbox paddingLeft={4} onCheckedChange={() => setRemoveStyling(!removeStyling)}>
                    <Typography variant="delta">Remove styling</Typography>
                  </Checkbox>
                </>
              )}

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
            </Flex>

            <Box paddingTop={4} height="100vh">
              <iframe
                key={`${removeHeader}-${removeStyling}`}
                src={`${store.clientHost}/report/${selectedProject.brewName}?removeHeader=${removeHeader}&removeStyling=${removeStyling}`}
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '10px' }}
              />
            </Box>
          </Box>
        )}
      </Layouts.Content>
    </div>
  );
}

export { Dashboard };
