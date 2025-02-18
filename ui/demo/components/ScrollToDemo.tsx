import { BoundingBox } from '@allenai/pdf-components';
import * as React from 'react';

type Props = {
  pageIndex: number;
};

/*
 * Example target for the scroll util function
 */
export const ScrollToDemo: React.FunctionComponent<Props> = ({ pageIndex }: Props) => {
  const boundingBoxProps = {
    page: 4,
    top: 100,
    left: 100,
    height: 2,
    width: 2,
  };

  if (pageIndex !== boundingBoxProps.page) {
    return null;
  }

  return (
    <BoundingBox
      id="demoFigure"
      className="reader__sample-figure-scroll-bbox"
      isHighlighted={false}
      {...boundingBoxProps}
    />
  );
};
