import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
  scrollToId,
  TransformContext,
  UiContext,
} from '@allenai/pdf-components';
import * as React from 'react';

import { DemoHeaderContextProvider } from '../context/DemoHeaderContext';
import { Header } from './Header';
import { ScrollToDemo } from './ScrollToDemo';
import { HighlightOverlayDemo, Passage } from './HighlightOverlayDemo';


interface Props {
  paperId: string;
}


export interface ReaderRef {
  search: (searchString: string) => void;
}


export const Reader = React.forwardRef<ReaderRef, Props>(({ paperId }, ref) => {
  const { pageDimensions, numPages } = React.useContext(DocumentContext);
  const { setScrollRoot } = React.useContext(ScrollContext);
  const { scale, setScale } = React.useContext(TransformContext);
  const { setIsShowingHighlightOverlay } = React.useContext(UiContext);

  // ref for the div in which the Document component renders
  const pdfContentRef = React.createRef<HTMLDivElement>();

  // ref for the scrollable region where the pages are rendered
  const pdfScrollableRef = React.createRef<HTMLDivElement>();

  const boxesJson = `public/${paperId}-boxes.json`
  const samplePdfUrl = `public/${paperId}.pdf`;

  React.useEffect(() => {
    setScrollRoot(null);
  }, []);

  const [passages, setPassages] = React.useState<Passage[]>([]);

  // Surface some functions on this component, like the ability to scroll
  // to caller-specified strings.
  React.useImperativeHandle(ref, () => ({
    search(searchString: string) {
      for (const el of document.querySelectorAll(".reader__passage-scroll-target")) {
        if (el instanceof HTMLElement) {
          if (searchString && el.dataset["text"] && el.dataset["text"].includes(searchString) && el.id) {
            scrollToId(el.id);
            break;
          }
        }
      }
    },
  }));

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
      const passages = [];
      for (const i in data) {
        const entry = data[i];
        const boxes = []
        for (const box of entry.boxes) {
          boxes.push({
            page: box.page,
            top: box.top * pageDimensions.height,
            left: box.left * pageDimensions.width,
            width: box.width * pageDimensions.width,
            height: box.height * pageDimensions.height,
          });
        }
        passages.push({ id: `passage-${i}`, text: entry.passage, boxes });
      }
      setPassages(passages);
      // Zoom out. Show highlight overlay by default.
      setScale(.5);
      setIsShowingHighlightOverlay(true);
    });
  }, [pageDimensions, paperId]);

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
                  <HighlightOverlayDemo pageIndex={i} passages={passages} />
                  {/* <TextHighlightDemo pageIndex={i} boxes={boxes} /> */}
                  <ScrollToDemo pageIndex={i} />
                </Overlay>
              </PageWrapper>
            ))}
          </div>
        </DocumentWrapper>
      </DemoHeaderContextProvider>
    </div>
  );
});
