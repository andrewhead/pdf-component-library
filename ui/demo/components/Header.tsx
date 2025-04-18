import { PageNumberControl, scrollToId, UiContext } from '@allenai/pdf-components';
import classnames from 'classnames';
import * as React from 'react';

import { SimpleZoomControl } from './SimpleZoomControl';

type Props = {
  pdfUrl: string;
  passageContext: string | null;
};

export const Header: React.FunctionComponent<Props> = ({ passageContext }) => {
  const {
    isShowingTextHighlight,
    isShowingHighlightOverlay,
    setIsShowingHighlightOverlay,
    setIsShowingTextHighlight,
  } = React.useContext(UiContext);

  const handleToggleHighlightOverlay = React.useCallback(() => {
    setIsShowingHighlightOverlay(!isShowingHighlightOverlay);
  }, [isShowingHighlightOverlay]);

  const handleToggleTextHighlight = React.useCallback(() => {
    setIsShowingTextHighlight(!isShowingTextHighlight);
  }, [isShowingTextHighlight]);

  const handleScrollToFigure = React.useCallback(() => {
    setIsShowingTextHighlight(false);
    setIsShowingHighlightOverlay(false);

    const id = 'demoFigure';
    scrollToId(id);
  }, []);

  return (
    <div className="reader__header">
      <div className="header-control">
        <PageNumberControl />
      </div>
      <div className="header-control">
        <SimpleZoomControl />
      </div>
      <div className={classnames('header-control', { 'is-selected': isShowingHighlightOverlay })}>
        <a onClick={handleToggleHighlightOverlay}>Highlight Claims</a>
      </div>
      {/* <div className={classnames('header-control', { 'is-selected': isShowingTextHighlight })}>
        <a onClick={handleToggleTextHighlight}>Highlight Claims</a>
      </div> */}
      {passageContext && (
        <div className="reader__header__passage-context">
          <span className="reader__header__passage-context__text">
            <b>Context for highlighted passage</b>: {passageContext}
          </span>
        </div>
      )}
    </div>
  );
};
