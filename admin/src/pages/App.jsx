import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Page } from '@strapi/strapi/admin';

import { Dashboard } from './Dashboard';
import { Create } from './Create';

function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path={`create`} element={<Create />} />
        <Route path="*" element={<Page.Error />} />
      </Routes>
    </div>
  );
}

export { App };
