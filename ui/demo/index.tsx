/**
 * This is the main entry point for the UI. You should not need to make any
 * changes here.
 */

import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Reader } from './components/Reader';

const App = () => (
  <ContextProvider>
    <Reader paperId="explainable-notes" />
  </ContextProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
