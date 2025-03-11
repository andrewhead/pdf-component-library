import {
  BoundingBoxType,
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
  myNum: number;
}


export interface ReaderRef {
  search: (searchString: string) => void;
}


export const Reader = React.forwardRef<ReaderRef, Props>(({ paperId, myNum }, ref) => {
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
      // add explanation to -boxes.json
      for (const i in data) {
        const entry = data[i];
        const boxes: BoundingBoxType[] = [];

        function saveBox(box: any) { 
          boxes.push({
            page: box.page,
            top: box.top * pageDimensions.height,
            left: box.left * pageDimensions.width,
            width: box.width * pageDimensions.width,
            height: box.height * pageDimensions.height,
          });
        }

        let lastBox = null;
        for (const box of entry.boxes) {
          // Coalesce boxes that are right next to each other.
          if (lastBox !== null) {
            const distance = box.left - (lastBox.left + lastBox.width);
            if (box.page === lastBox.page && distance > 0 && distance < 0.05) {
              const newTop = Math.min(lastBox.top, box.top);
              const newBottom = Math.max(lastBox.top + lastBox.height, box.top + box.height);
              lastBox = {
                page: lastBox.page,
                left: lastBox.left,
                width: (box.left + box.width) - lastBox.left,
                top: newTop,
                height: newBottom - newTop,
              }
            } else {
              saveBox(lastBox);
              lastBox = box;
            }
          } else {
            lastBox = box;
          }
        }
        saveBox(lastBox);
        passages.push({ 
          id: `passage-${i}`, 
          text: entry.passage, 
          explanation: entry.explanation,
          boxes
        });
      }

      // Deduplicate passages that intersect with each other.
      // (Thank you Copilot for the heavy lifting on this snippet.)
      const deduplicatedPassages: Passage[] = [];
      for (const passage of passages) {
        let overlap = false;
        for (const other of deduplicatedPassages) {
          for (const box of passage.boxes) {
            for (const otherBox of other.boxes) {
              if (box.page === otherBox.page) {
                const boxLeft = box.left;
                const boxRight = box.left + box.width;
                const otherLeft = otherBox.left;
                const otherRight = otherBox.left + otherBox.width;
                const boxTop = box.top;
                const boxBottom = box.top + box.height;
                const otherTop = otherBox.top;
                const otherBottom = otherBox.top + otherBox.height;
                if (
                  (boxLeft < otherRight && boxRight > otherLeft) &&
                  (boxTop < otherBottom && boxBottom > otherTop)
                ) {
                  overlap = true;
                  break;
                }
              }
              if (overlap) break;
            }
            if (overlap) break;
          }
          if (overlap) break;
        }
        if (!overlap) {
          deduplicatedPassages.push(passage);
        }
      }

      setPassages(deduplicatedPassages);
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
                  <HighlightOverlayDemo pageIndex={i} passages={passages} myNum={myNum}/>
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
