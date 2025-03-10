/**
 * This is the main entry point for the UI. You should not need to make any
 * changes here.
 */

import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

declare global {
  interface Window {
    ReaderApp: React.FunctionComponent<{ paperId: string, myNum: number }>;
    renderReaderApp: (paperId: string, containerId: string, myNum: number) => void;
    readerRef: React.RefObject<ReaderRef>;
  }
}

import { Reader, ReaderRef } from './components/Reader';

interface Props {
  paperId: string;
  myNum: number;
}

const readerRef = React.createRef<ReaderRef>();

const ReaderApp: React.FunctionComponent<Props> = ({ paperId, myNum }) => (
  <ContextProvider>
    <Reader ref={readerRef} paperId={paperId} myNum={myNum}/>
  </ContextProvider>
);

// Uncomment this when you want to test this out as a standalone app.
// ReactDOM.render(<ReaderApp />, document.getElementById('root'));

window.ReaderApp = ReaderApp;
window.renderReaderApp = (paperId: string, containerId: string, myNum: number) => {
  ReactDOM.render(<ReaderApp myNum={myNum} paperId={paperId} />, document.getElementById(containerId));
}
window.readerRef = readerRef;