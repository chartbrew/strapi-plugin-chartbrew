/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from '@strapi/helper-plugin';
import { Layout } from '@strapi/design-system/Layout';

import pluginId from '../../pluginId';
import Dashboard from '../Dashboard';
import Create from '../Create';

function App() {
  return (
    <div>
      <Layout>
        <Switch>
          <Route path={`/plugins/${pluginId}`} component={Dashboard} exact />
          <Route path={`/plugins/${pluginId}/create`} component={Create} exact />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
