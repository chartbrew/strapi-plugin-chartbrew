// import { Page } from '@strapi/strapi/admin';
// import { Routes, Route } from 'react-router-dom';

// import { HomePage } from './HomePage';

// const App = () => {
//   return (
//     <Routes>
//       <Route index element={<HomePage />} />
//       <Route path="*" element={<Page.Error />} />
//     </Routes>
//   );
// };

// export { App };

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { PLUGIN_ID } from '../pluginId';
import Dashboard from './Dashboard';
import Create from './Create';

function App() {
  return (
    <div>
      <Routes>
        <Route index path={`/plugins/${PLUGIN_ID}`} element={Dashboard} />
        <Route path={`/plugins/${PLUGIN_ID}/create`} element={Create} />
      </Routes>
    </div>
  );
}

export { App };
