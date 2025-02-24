import { BoundingBox, BoundingBoxType, HighlightOverlay, UiContext } from '@allenai/pdf-components';
import * as React from 'react';


type Props = {
  pageIndex: number;
  passages: Passage[];
};


export interface Passage {
  id: string;
  text: string;
  boxes: BoundingBoxType[];
}

/*
 * Example of the HighlightOverlay component
 */
export const HighlightOverlayDemo: React.FunctionComponent<Props> = ({ pageIndex, passages }: Props) => {
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
        if (box.page === pageIndex) {
          const props = {
            ...box,
            className: 'reader__text-highlight__bbox',
            // Set isHighlighted to true for highlighted styling
            isHighlighted: true,
            key: `${pi}-${i}`,
          };
          boxElements.push(<BoundingBox {...props} />);
          renderedAnything = true;
        }
      });
      if (renderedAnything && passage.boxes.length > 0) {
        let props: any = { ...passage.boxes[0] };
        props.top = props.top - 150;  // Offset so we will scroll to this even when the 
        props.id = `passage-${pi}-scroll-target`;
        props.className = 'reader__passage-scroll-target'
        props.key = props.id;
        props["data-text"] = passage.text;
        boxElements.push(<BoundingBox {...props} />)
      }
    });
    return boxElements;
  }

  function renderHighlightOverlayBoundingBoxes(): Array<React.ReactElement> {
    const boxElements: Array<React.ReactElement> = [];
    passages.forEach((passage) => {
      passage.boxes.map((box, i) => {
        // Only render this BoundingBox if it belongs on the current page
        if (box.page === pageIndex) {
          const props = {
            ...box,
            className: 'reader__highlight-overlay__bbox',
            key: i,
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
