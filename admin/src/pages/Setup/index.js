/*
 *
 * Setup page - Only shows if the project was not set up yet
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { HeaderLayout , ContentLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Field, FieldLabel, FieldInput } from '@strapi/design-system/Field';
import { Stack } from '@strapi/design-system/Stack';
import Magic from '@strapi/icons/Magic';
import { Button } from '@strapi/design-system/Button';
import { LinkButton } from '@strapi/design-system/LinkButton';
import { Link } from '@strapi/design-system/Link';
import Check from '@strapi/icons/Check';
import Cross from '@strapi/icons/Cross';
import { Alert } from '@strapi/design-system/Alert';
import ChevronRight from '@strapi/icons/ChevronRight';
import ExternalLink from '@strapi/icons/ExternalLink';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';

import pluginId from '../../pluginId';
import { getSettings, setSettings } from '../../actions/store';

const defaultHost = 'https://api.chartbrew.com';
const defaultClientHost = 'https://app.chartbrew.com';

const strapiHostEnv = process.env.STRAPI_ADMIN_BACKEND_URL

function Dashboard() {
  const [host, setHost] = useState(defaultHost);
  const [clientHost, setClientHost] = useState(defaultClientHost);
  const [strapiHost, setStrapiHost] = useState(strapiHostEnv || "");
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [chartbrewUser, setChartbrewUser] = useState({});
  const [strapiToken, setStrapiToken] = useState('');
  const [savingToken, setSavingToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [localAlert, setLocalAlert] = useState(false);

  useEffect(() => {
    // get plugin settings
    getSettings()
      .then((data) => {
        setHost(data.host);
        setClientHost(data.clientHost);
        setToken(data.token);
        setHasToken(data.hasToken);
        setStrapiHost(data.strapiHost);
      });
  }, []);

  const _onValidateData = () => {
    return !host || host.indexOf('http') === -1 || !token || !clientHost;
  };

  const _onUseManagedClicked = () => {
    setHost(defaultHost);
    setClientHost(defaultClientHost);
  };

  const _onFormSubmit = () => {
    setSaved(false);
    setError(false);
    setLoading(true);

    setSettings({ clientHost, host, token, strapiHost })
      .then(() => {
        return fetch(`${host}/user/relog`, {
          method: 'POST',
          headers: new Headers({
            accept: 'application/json',
            authorization: `Bearer ${token}`,
          }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error(400);

        return response.json();
      })
      .then((user) => {
        setSaved(true);
        setLoading(false);
        setChartbrewUser(user);

        if (process.env.STRAPI_ADMIN_BACKEND_URL.indexOf("http://localhost") > -1
          && host.indexOf("http://localhost") === -1
        ) {
          setLocalAlert(true);
        }
      })
      .catch(() => {
        setSaved(false);
        setError(true);
        setLoading(false);
      });
  };

  const _onSaveStrapiToken = () => {
    if (!strapiToken) return;

    setSavingToken(true);
    setSettings({ strapiToken })
      .then((data) => {
        setSavingToken(false);
        setHasToken(data.hasToken);
        setStrapiToken('');
      })
      .catch(() => setSavingToken(false));
  };

  const _onRemoveStrapiToken = () => {
    setSavingToken(true);
    setSettings({ strapiToken: false })
      .then((data) => {
        setSavingToken(false);
        setHasToken(data.hasToken);
      })
      .catch(() => setSavingToken(false));
  };

  return (
    <div>
      <HeaderLayout
        title="Chartbrew Setup"
        subtitle="Connect to Chartbrew to start visualizing your Strapi data"
        primaryAction={(
          <LinkButton
            endIcon={<ExternalLink />}
            href="https://chartbrew.com?utm_source=strapi_plugin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about Chartbrew
          </LinkButton>
        )}
      />
      <Stack spacing={8}>
        <ContentLayout>
          <Box padding={6} paddingLeft={8} paddingRight={8} shadow="filterShadow" background="neutral0">
            <Box paddingTop={2}>
              <Typography variant="beta">Get started with Chartbrew</Typography>
            </Box>
            <Box>
              <Typography variant="omega">
                Learn how to get started with Chartbrew using the managed service or by self-hosting
              </Typography>
            </Box>
            <Box paddingTop={6}>
              <TabGroup label="Two ways to get started with Chartbrew" id="tabs" variant="simple">
                <Tabs>
                  <Tab>Managed service</Tab>
                  <Tab>Self-hosting</Tab>
                </Tabs>
                <TabPanels>
                  <TabPanel>
                    <Box color="neutral800" padding={4} background="neutral0">
                      <Box>
                        <Typography>{'While using the managed service, all you have to do is to create an account at chartbrew.com and then follow the instructions to create an API key: '}</Typography>
                      </Box>
                      <Box paddingTop={2}>
                        <LinkButton href="https://app.chartbrew.com/signup" target="_blank" rel="noopener" endIcon={<ExternalLink />} variant="tertiary">
                          {'1. Create an account and activate your 30-day trial here '}
                        </LinkButton>
                      </Box>
                      <Box paddingTop={2}>
                        <LinkButton href="https://chartbrew.com/blog/how-to-create-api-keys-in-chartbrew/" target="_blank" rel="noopener" endIcon={<ExternalLink />} variant="tertiary">
                          {'2. How to get your Chartbrew API key '}
                        </LinkButton>
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box color="neutral800" padding={4} background="neutral0">
                      <Box>
                        <Typography>{'Chartbrew can be self-hosted in a number of ways. You can use the Docker image, a VPS, or plaforms like Heroku and Vercel. Below are some links to get you started: '}</Typography>
                      </Box>
                      <Box paddingTop={2}>
                        <LinkButton href="https://github.com/chartbrew/chartbrew?utm_source=strapi-plugin" target="_blank" rel="noopener" endIcon={<ExternalLink />} variant="tertiary">
                          {'Chartbrew on GitHub '}
                        </LinkButton>
                      </Box>
                      <Box paddingTop={2}>
                        <LinkButton href="https://docs.chartbrew.com/deployment/#run-the-application-with-docker?utm_source=strapi-plugin" target="_blank" rel="noopener" endIcon={<ExternalLink />} variant="tertiary">
                          {'Run Chartbrew using the Docker image '}
                        </LinkButton>
                      </Box>
                      <Box paddingTop={2}>
                        <LinkButton href="https://chartbrew.com/blog/how-to-deploy-chartbrew-on-heroku-and-vercel?utm_source=strapi-plugin" target="_blank" rel="noopener" endIcon={<ExternalLink />} variant="tertiary">
                          {'Deploy Chartbrew on Heroku & Vercel '}
                        </LinkButton>
                      </Box>
                      <Box paddingTop={2}>
                        <LinkButton href="https://chartbrew.com/blog/how-to-create-api-keys-in-chartbrew/" target="_blank" rel="noopener" endIcon={<ExternalLink />} variant="tertiary">
                          {'How to get your Chartbrew API key '}
                        </LinkButton>
                      </Box>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </Box>
          </Box>
        </ContentLayout>

        <ContentLayout>
          <Box padding={6} paddingLeft={8} paddingRight={8} shadow="filterShadow" background="neutral0">
            <Box paddingTop={2}>
              <Typography variant="beta">Connect to Chartbrew</Typography>
            </Box>
            <Box>
              <Typography variant="omega">
                You can change this to your own instance of Chartbrew,
                or use the managed service to not have to host the platform yourself.
              </Typography>
            </Box>

            <Box paddingTop={4}>
              <Field name="host">
                <Stack spacing={1}>
                  <FieldLabel>Chartbrew application host (frontend URL)</FieldLabel>
                  <FieldInput
                    type="text"
                    placeholder="Enter your Chartbrew application host"
                    value={clientHost}
                    onChange={(e) => setClientHost(e.target.value)}
                  />
                </Stack>
              </Field>
            </Box>

            <Box paddingTop={4}>
              <Field name="host">
                <Stack spacing={1}>
                  <FieldLabel>Chartbrew API host (backend URL)</FieldLabel>
                  <FieldInput
                    type="text"
                    placeholder="Enter your Chartbrew API host"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                  />
                </Stack>
              </Field>
            </Box>

            <Box paddingTop={4}>
              <Field name="host">
                <Stack spacing={1}>
                  <FieldLabel>Your Strapi backend URL</FieldLabel>
                  <FieldInput
                    type="text"
                    placeholder="'https://you-strapi-url.com' or 'http://localhost:1337' for local env"
                    value={strapiHost}
                    onChange={(e) => setStrapiHost(e.target.value)}
                  />
                </Stack>
              </Field>
            </Box>

            <Box paddingTop={4}>
              <Button
                variant='tertiary'
                endIcon={<Magic />}
                onClick={_onUseManagedClicked}
                size="S"
              >
                Use managed Chartbrew address
              </Button>
            </Box>

            <Box paddingTop={4}>
              <Field name="token">
                <Stack spacing={1}>
                  <FieldLabel>
                    {'Chartbrew API Token - '}
                    <Link href="https://chartbrew.com/blog/how-to-create-api-keys-in-chartbrew/" isExternal>{' How to generate an API Token'}</Link>
                  </FieldLabel>
                  <FieldInput
                    type="password"
                    placeholder="Enter your Chartbrew API Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </Stack>
              </Field>
            </Box>

            <Box paddingTop={4}>
              <Stack horizontal spacing={2}>
                <Button
                  variant={(saved && 'success-light') || (error && 'danger-light') || 'default'}
                  disabled={_onValidateData()}
                  loading={loading}
                  endIcon={(saved && (<Check />)) || (error && (<Cross />)) || null}
                  onClick={_onFormSubmit}
                >
                  Save and check the connection
                </Button>
                {chartbrewUser.id && (
                  <LinkButton
                    variant="secondary"
                    endIcon={<ChevronRight />}
                    to={`/plugins/${pluginId}`}
                  >
                    Continue to your dashboard
                  </LinkButton>
                )}
              </Stack>
            </Box>

            {error && (
              <Box paddingTop={4}>
                <Alert
                  closeLabel="Close alert"
                  title="Authentication failed"
                  variant="danger"
                  onClose={() => setError(false)}
                >
                  Something went wrong with the authentication.
                  Please check the host and token are correct and try again.
                </Alert>
              </Box>
            )}

            {saved && (
              <Box paddingTop={4}>
                <Alert
                  closeLabel="Close alert"
                  title={`Welcome ${chartbrewUser.name}!`}
                  variant="success"
                  onClose={() => setSaved(false)}
                >
                  {'Successfully authenticated with Chartbrew. Head over to your dashboard to get started. '}
                </Alert>
              </Box>
            )}

            {localAlert && (
              <Box paddingTop={4}>
                <Alert
                  closeLabel="Close alert"
                  title={"Chartbrew might not be able to create charts"}
                  variant="default"
                  onClose={() => setLocalAlert(false)}
                >
                  {'It seems you are running Strapi on your local machine and you are connecting to a Chartbrew instance that is hosted on an external server. You might not be able to create new visualizations from your Strapi data, but you can create the charts in Chartbrew and then see them in your Strapi dashboard. '}
                </Alert>
              </Box>
            )}
          </Box>
        </ContentLayout>

        <ContentLayout>
          {!hasToken && (
            <Box padding={6} paddingLeft={8} paddingRight={8} shadow="filterShadow" background="neutral0">
              <Box paddingTop={2}>
                <Typography variant="delta">Allow Chartbrew to create charts from Strapi data</Typography>
              </Box>
              <Box>
                <Typography variant="omega">
                  {'Create a Read-only API token and enter it in the field below. '}
                  <Link to="/settings/api-tokens">{'Click here to create an API token '}</Link>
                </Typography>
              </Box>

              <Box paddingTop={4}>
                <Field name="host">
                  <Stack spacing={1}>
                    <FieldLabel>Strapi API Token</FieldLabel>
                    <FieldInput
                      type="password"
                      placeholder="Enter a Strapi Read-Only token here"
                      value={strapiToken}
                      onChange={(e) => setStrapiToken(e.target.value)}
                    />
                  </Stack>
                  <Typography variant="pi">
                    {'You will not be able to see this token after you save it. '}
                  </Typography>
                </Field>
              </Box>
              <Box paddingTop={4}>
                <Button
                  variant={(saved && 'success-light') || (error && 'danger-light') || 'default'}
                  disabled={!strapiToken && !hasToken}
                  loading={savingToken}
                  onClick={_onSaveStrapiToken}
                >
                  Save token
                </Button>
              </Box>
            </Box>
          )}

          {hasToken && (
            <Box padding={6} paddingLeft={8} paddingRight={8} shadow="filterShadow" background="neutral0">
              <Box paddingTop={2}>
                <Typography variant="delta">Chartbrew can now create charts from your Strapi data</Typography>
              </Box>
              <Box>
                <Typography variant="omega">
                  {'Chartbrew uses your Strapi API token to create charts automatically from your Strapi dashboard. You can disallow this option by clicking the remove button below. '}
                </Typography>
              </Box>

              <Box paddingTop={4}>
                <Button variant="danger-light" onClick={_onRemoveStrapiToken}>
                  {'Remove Chartbrew\'s access '}
                </Button>
              </Box>

              <Box paddingTop={4}>
                <Alert
                  closeLabel="Close alert"
                  title="A note on Chartbrew's access"
                  variant="default"
                >
                  <p>
                    {'All existing charts will still have read access for your Strapi data. When removing the access, this will only be applied to future charts. To stop existing charts from reading the data, please head over to the Chartbrew app and remove the charts from there. '}
                  </p>
                </Alert>
              </Box>
            </Box>
          )}
        </ContentLayout>
      </Stack>
    </div>
  );
}

export default memo(Dashboard);
