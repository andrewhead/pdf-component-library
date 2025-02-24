/**
 * This is the main entry point for the UI. You should not need to make any
 * changes here.
 */

import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

declare global {
  interface Window {
    ReaderApp: React.FunctionComponent<{ paperId: string }>;
    renderReaderApp: (paperId: string, containerId: string) => void;
    readerRef: React.RefObject<ReaderRef>;
  }
}

import { Reader, ReaderRef } from './components/Reader';

interface Props {
  paperId: string;
}

const readerRef = React.createRef<ReaderRef>();

const ReaderApp: React.FunctionComponent<Props> = ({ paperId }) => (
  <ContextProvider>
    <Reader ref={readerRef} paperId={paperId} />
  </ContextProvider>
);

// Uncomment this when you want to test this out as a standalone app.
// ReactDOM.render(<ReaderApp />, document.getElementById('root'));

window.ReaderApp = ReaderApp;
window.renderReaderApp = (paperId: string, containerId: string) => {
  ReactDOM.render(<ReaderApp paperId={paperId} />, document.getElementById(containerId));
}
window.readerRef = readerRef;