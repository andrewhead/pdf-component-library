import * as React from 'react';

import { PageRotation } from '../rotate';
import { PageSizeContext, PageSizeContextData } from '../context/PageSizeContext';
import { ITransform, TransformContext } from '../context/TransformContext';

type Props = {
  className?: string;
  /**
   * top, left, height, and width are in screen pixel units
   * at 100% scaling of the page
   */
  top: number;
  left: number;
  height: number;
  width: number;
  onClick?: () => void;
};

export type BoundingBoxProps = Props;

export const BoundingBox: React.FunctionComponent<Props> = ({
  className,
  top,
  left,
  height,
  width,
  onClick,
}: Props) => {
  const pageSizeContext = React.useContext(PageSizeContext);
  const transformContext = React.useContext(TransformContext);
  const componentClassName = ['reader__page-overlay__bounding-box', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      className={componentClassName}
      style={computeStyleWithContext(top, left, height, width, pageSizeContext, transformContext)}
      onClick={onClick}
    />
  );
};

type StyleSizeProps = {
  top: number;
  left: number;
  height: number;
  width: number;
};

/**
 * Computes the style for the bounding box given the current page scaling and rotation context
 * TODO: top, left, height, and width can probably be collapsed into a BoundingBox type for storing
 *       size/placement info about boxes on the page.
 * @param top top value for the boundingbox
 * @param left left value for the boundingbox
 * @param height height value for the boundingbox
 * @param width width value for the boundingbox
 * @param pageSizeContext PageSizeContext from the context provider
 * @returns style object for the BoundingBox div
 */
export function computeStyleWithContext(
  top: number,
  left: number,
  height: number,
  width: number,
  pageSizeContext: PageSizeContextData,
  transformContext: ITransform,
): StyleSizeProps {
  const { pageSize } = pageSizeContext;
  const { rotation, scale } = transformContext;
  switch (rotation) {
    case PageRotation.Rotate90:
      return {
        top: left * scale,
        left: (pageSize.height - height - top) * scale,
        height: width * scale,
        width: height * scale,
      };
    case PageRotation.Rotate180:
      return {
        top: (pageSize.height - height - top) * scale,
        left: (pageSize.width - width - left) * scale,
        height: height * scale,
        width: width * scale,
      };
    case PageRotation.Rotate270:
      return {
        top: (pageSize.width - width - left) * scale,
        left: top * scale,
        height: width * scale,
        width: height * scale,
      };
    default:
      return {
        top: top * scale,
        left: left * scale,
        height: height * scale,
        width: width * scale,
      };
  }
}
