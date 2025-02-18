import {
  BoundingBoxType,
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
} from '@allenai/pdf-components';
import * as React from 'react';

import { DemoHeaderContextProvider } from '../context/DemoHeaderContext';
import { Header } from './Header';
import { ScrollToDemo } from './ScrollToDemo';
import { HighlightOverlayDemo } from './HighlightOverlayDemo';
import { TextHighlightDemo } from './TextHighlightDemo';


// interface Props {
//   paperId: string;
// }


export const Reader: React.FunctionComponent = () => {
  const { pageDimensions, numPages } = React.useContext(DocumentContext);
  const { setScrollRoot } = React.useContext(ScrollContext);

  // ref for the div in which the Document component renders
  const pdfContentRef = React.createRef<HTMLDivElement>();

  // ref for the scrollable region where the pages are rendered
  const pdfScrollableRef = React.createRef<HTMLDivElement>();

  const paperName = "explainable-notes";
  const boxesJson = `data/${paperName}-boxes.json`


  const samplePdfUrl = 'public/explainable-notes.pdf';

  React.useEffect(() => {
    setScrollRoot(null);
  }, []);

  const [boxes, setBoxes] = React.useState<BoundingBoxType[]>([]);
  // Attaches annotation data to paper
  React.useEffect(() => {
    // Don't execute until paper data and PDF document have loaded
    if (!pageDimensions.height || !pageDimensions.width) {
      return;
    }
    // Load JSON from boxesJson file.
    // This code is courtesy of Copilot.
    fetch(boxesJson)
    .then((response) => response.json())
    .then((data) => {
      const allBoxes = []
      for (const entry of data) {
        for (const box of entry.boxes) {
          allBoxes.push({
            page: box.page,
            top: box.top * pageDimensions.height,
            left: box.left * pageDimensions.width,
            width: box.width * pageDimensions.width,
            height: box.height * pageDimensions.height,
          })
        }
      }
      console.log(allBoxes);
      setBoxes(allBoxes);
    });
  }, [pageDimensions]);

  return (
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
                  <HighlightOverlayDemo pageIndex={i} boxes={boxes} />
                  <TextHighlightDemo pageIndex={i} boxes={boxes} />
                  <ScrollToDemo pageIndex={i} />
                </Overlay>
              </PageWrapper>
            ))}
          </div>
        </DocumentWrapper>
      </DemoHeaderContextProvider>
    </div>
  );
};
