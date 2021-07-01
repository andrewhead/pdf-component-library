import { generatePageId } from "../scroll";
import { Nullable, PdfPixelSize } from "../types";
import { PageSizeContext } from "./PageSizeContext";

import { Page } from "react-pdf/dist/esm/entry.webpack";
import * as React from "react";
import { RenderFunction } from "react-pdf/dist/Page";

/**
 * A subset of react-pdf's Page component props exposed by this wrapper
 */
type PageProps = {
  error?: string | React.ReactElement | RenderFunction;
  loading?: string | React.ReactElement | RenderFunction;
  noData?: string | React.ReactElement | RenderFunction;
  pageIndex?: number;
  pageNumber?: number;
  scale: number; // Unlike the react-pdf component, this is now required
};
type Props = {
  className?: string;
  pageSize: Nullable<PdfPixelSize>;
} & PageProps;

export default class PageWrapper extends React.PureComponent<Props> {
  canvasRef = React.createRef<HTMLCanvasElement>();

  onClick = (e: any) => {
    console.log(e);
  };

  computeStyle = (): { width: number } | undefined => {
    const { pageSize, scale } = this.props;
    if (!pageSize) {
      return undefined;
    }
    return {
      width: pageSize.width * (scale || 1.0),
    };
  };

  render() {
    const { pageSize, error, loading, noData, pageIndex, pageNumber, scale, children } =
      this.props;
    // Click events from the Outline only give pageNumber, so we need to be clever when setting the ID.
    const pageNumberForId = this.props.pageNumber
      ? this.props.pageNumber
      : this.props.pageIndex
      ? this.props.pageIndex + 1
      : 1;

    // Don't display until we have page size data
    // TODO: Handle this nicer so we display either the loading or error treatment
    if (!pageSize) {
      return null;
    }
    // Width needs to be set to prevent the outermost Page div from extending to fit the parent,
    // and mis-aligning the text layer.
    // TODO: Can we CSS this to auto-shrink?
    return (
      <div
        id={generatePageId(pageNumberForId)}
        className="reader__page"
        style={this.computeStyle()}
      >
        <PageSizeContext.Provider value={{ pageSize, scale}}>
          {children}
        </PageSizeContext.Provider>
        <Page
          width={pageSize.width}
          error={error}
          loading={loading}
          noData={noData}
          pageIndex={pageIndex}
          pageNumber={pageNumber}
          scale={scale}
          canvasRef={this.canvasRef}
          onClick={this.onClick}
          renderAnnotationLayer={false}
        />
      </div>
    );
  }
}
