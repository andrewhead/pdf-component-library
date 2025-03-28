import { BoundingBox, BoundingBoxType, HighlightOverlay, UiContext } from '@allenai/pdf-components';
import Popover from 'antd/lib/popover';
import * as React from 'react';

type Summaries = Record<
  string,
  Array<[string, string, string, string, string, string]>
>;



type Props = {
  pageIndex: number;
  passages: Passage[];
  myNum: number;
  selectedSentence: string | null;
  setSelectedSentence: (sentence: string | null) => void;
};


export interface Passage {
  id: string;
  text: string;
  boxes: BoundingBoxType[];
  explanation?: string;
}

/*
 * Example of the HighlightOverlay component
 */
export const HighlightOverlayDemo: React.FunctionComponent<Props> = ({ pageIndex, passages, myNum, selectedSentence, setSelectedSentence }: Props) => {
  const { isShowingHighlightOverlay } = React.useContext(UiContext);
  if (!isShowingHighlightOverlay) {
    return null;
  }

  function renderTextHighlights(): Array<React.ReactElement> {
    const boxElements: Array<React.ReactElement> = [];
    passages.forEach((passage, pi) => {
      let renderedAnything = false;
      passage.boxes.map((box, i) => {
        // Only render this BoundingBox if it belongs on the current page
        const classes = ['reader__text-highlight__bbox'];
        if (selectedSentence && passage.id === selectedSentence) {
          classes.push('reader__highlight-overlay__bbox__selected');
        }
        if (box.page === pageIndex) {
          const props = {
            ...box,
            className: classes.join(' '),
            // Set isHighlighted to true for highlighted styling
            isHighlighted: true,
            key: `${pi}-${i}`,
            onClick: () => { setSelectedSentence(passage.id); }
          };

          const content = passage.explanation || passage.text;
          // const poppedBox = (
          //   <Popover content={content} trigger="hover"
          //     overlayClassName="reader__highlight-overlay__popover">
          //     <BoundingBox {...props} />
          //   </Popover>
          // );
          const poppedBox = (
            <>
            {/* <Popover content={content} trigger="hover" 
              overlayClassName="reader__highlight-overlay__popover"> */}
              <BoundingBox {...props} />
            {/* </Popover> */}
            </>
          );

          boxElements.push(poppedBox);
          renderedAnything = true;
        }
      });
      // Render a target that we can scroll to automatically.
      if (renderedAnything && passage.boxes.length > 0) {
        let props: any = { ...passage.boxes[0] };
        // Offset the top of the box. There is a fixed-height header which
        // will occlude the passage if we don't scroll a little bit above that passage.
        props.top = props.top - 150;
        props.id = `passage-${pi}-scroll-target`;
        props.className = 'reader__passage-scroll-target';
        props.key = props.id;
        // Save the text so that we can do a text lookup later.
        props['data-text'] = passage.text;

        boxElements.push(<BoundingBox {...props} />);
      }
    });
    return boxElements;
  }

  function renderHighlightOverlayBoundingBoxes(): Array<React.ReactElement> {
    const boxElements: Array<React.ReactElement> = [];
    passages.forEach((passage) => {
      passage.boxes.map((box, i) => {
        const classes = ['reader__highlight-overlay__bbox'];
        // Only render this BoundingBox if it belongs on the current page
        if (box.page === pageIndex) {
          const props = {
            ...box,
            className: classes.join(' '),
            key: `${passage.id}-${i}`,
          };

          boxElements.push(<BoundingBox {...props} />);
        }
      });
    });
    return boxElements;
  }

  return (
    <>
      {/* Text highlight functionality was borrowed from the 'TextHighlightDemo' layer. */}
      <>{renderTextHighlights()}</>
      {/* This overlay is what fades away non-highlighted content */}
      <HighlightOverlay pageIndex={pageIndex}>
        {renderHighlightOverlayBoundingBoxes()}
      </HighlightOverlay>
    </>
  );
};
