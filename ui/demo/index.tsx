/**
 * This is the main entry point for the UI. You should not need to make any
 * changes here.
 */

import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Reader } from './components/Reader';

// Get the paperID from the URL
const paperId = window.location.pathname.split('/').pop() || 'explainable-notes';

const App = () => (
  <ContextProvider>
    <Reader paperId={paperId} />
  </ContextProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
