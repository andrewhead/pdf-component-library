import { BoundingBox, BoundingBoxType, HighlightOverlay, UiContext } from '@allenai/pdf-components';
import * as React from 'react';

type Props = {
  pageIndex: number;
  boxes: BoundingBoxType[];
};

/*
 * Example of the HighlightOverlay component
 */
export const HighlightOverlayDemo: React.FunctionComponent<Props> = ({ pageIndex, boxes }: Props) => {
  const { isShowingHighlightOverlay } = React.useContext(UiContext);
  if (!isShowingHighlightOverlay) {
    return null;
  }

  function renderTextHighlights(): Array<React.ReactElement> {
    const boxElements: Array<React.ReactElement> = [];
    boxes.map((box, i) => {
      // Only render this BoundingBox if it belongs on the current page
      if (box.page === pageIndex) {
        const props = {
          ...box,
          className: 'reader__sample-text-highlight__bbox',
          // Set isHighlighted to true for highlighted styling
          isHighlighted: true,
          key: i,
        };

        boxElements.push(<BoundingBox {...props} />);
      }
    });
    return boxElements;
  }

  function renderHighlightOverlayBoundingBoxes(): Array<React.ReactElement> {
    const boxElements: Array<React.ReactElement> = [];
    boxes.map((box, i) => {
      // Only render this BoundingBox if it belongs on the current page
      if (box.page === pageIndex) {
        const props = {
          ...box,
          className: 'reader__sample-highlight-overlay__bbox',
          key: i,
        };

        boxElements.push(<BoundingBox {...props} />);
      }
    });
    return boxElements;
  }

  return (
    <>
      {/* Text highlight functionality was borrowed from the 'TextHighlightDemo' layer. */}
      <>{renderTextHighlights()}</>
      <HighlightOverlay pageIndex={pageIndex}>
        {renderHighlightOverlayBoundingBoxes()}
      </HighlightOverlay>
    </>
  );
};
