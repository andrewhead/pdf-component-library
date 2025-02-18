import { BoundingBox, BoundingBoxType, UiContext } from '@allenai/pdf-components';
import * as React from 'react';

type Props = {
  pageIndex: number;
  boxes: BoundingBoxType[];
};

/*
 * Example of BoundingBoxes used as text highlights
 */
export const TextHighlightDemo: React.FunctionComponent<Props> = ({ pageIndex, boxes }: Props) => {
  const { isShowingTextHighlight } = React.useContext(UiContext);
  if (!isShowingTextHighlight) {
    return null;
  }

  function renderHighlightedBoundingBoxes(): Array<React.ReactElement> {
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

  return <React.Fragment>{renderHighlightedBoundingBoxes()}</React.Fragment>;
};
