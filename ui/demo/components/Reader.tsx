import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
} from '@allenai/pdf-components';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';

import { DemoHeaderContextProvider } from '../context/DemoHeaderContext';
import { Header } from './Header';
import { ScrollToDemo } from './ScrollToDemo';
import { TextHighlightDemo } from './TextHighlightDemo';

export const Reader: React.FunctionComponent<RouteComponentProps> = () => {
  const { pageDimensions, numPages } = React.useContext(DocumentContext);
  const { setScrollRoot } = React.useContext(ScrollContext);

  // ref for the div in which the Document component renders
  const pdfContentRef = React.createRef<HTMLDivElement>();

  // ref for the scrollable region where the pages are rendered
  const pdfScrollableRef = React.createRef<HTMLDivElement>();

  const samplePdfUrl = 'public/2112.07873v1.pdf';

  React.useEffect(() => {
    setScrollRoot(null);
  }, []);

  // Attaches annotation data to paper
  React.useEffect(() => {
    // Don't execute until paper data and PDF document have loaded
    if (!pageDimensions.height || !pageDimensions.width) {
      return;
    }
  }, [pageDimensions]);

  return (
    <BrowserRouter>
      <Route path="/">
        <div className="reader__container">
          <DemoHeaderContextProvider>
            <Header pdfUrl={samplePdfUrl} />
            <DocumentWrapper
              className="reader__main"
              file={samplePdfUrl}
              inputRef={pdfContentRef}
              renderType={RENDER_TYPE.SINGLE_CANVAS}>
              <div className="reader__page-list" ref={pdfScrollableRef}>
                {Array.from({ length: numPages }).map((_, i) => (
                  <PageWrapper key={i} pageIndex={i} renderType={RENDER_TYPE.SINGLE_CANVAS}>
                    <Overlay>
                      <TextHighlightDemo pageIndex={i} />
                      <ScrollToDemo pageIndex={i} />
                    </Overlay>
                  </PageWrapper>
                ))}
              </div>
            </DocumentWrapper>
          </DemoHeaderContextProvider>
        </div>
      </Route>
    </BrowserRouter>
  );
};
