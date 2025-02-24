import { PageNumberControl, scrollToId, UiContext } from '@allenai/pdf-components';
import classnames from 'classnames';
import * as React from 'react';

import { SimpleZoomControl } from './SimpleZoomControl';

type Props = {
  pdfUrl: string;
};

export const Header: React.FunctionComponent<Props> = () => {
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

  const searchRef = React.useRef<HTMLInputElement>(null);
  const search = React.useCallback(() => {
    const searchString = searchRef.current?.value;
    for (const el of document.querySelectorAll(".reader__passage-scroll-target")) {
      if (el instanceof HTMLElement) {
        if (searchString && el.dataset["text"] && el.dataset["text"].includes(searchString) && el.id) {
          scrollToId(el.id);
          break;
        }
      }
    }
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
      <div className="header-control">
        <a onClick={search}>Find</a>
        <input ref={searchRef} type="text" placeholder="[string]" />
      </div>
    </div>
  );
};
