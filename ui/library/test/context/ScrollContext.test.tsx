import { expect } from 'chai';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

import { Nullable } from '../../../library/src/components/types/utils';
import { NodeDestination } from '../../src/components/types/outline';
import {
  IScrollContext,
  ScrollContext,
  useScrollContextProps,
} from '../../src/context/ScrollContext';
import MockIntersectionObserver from '../mock/MockIntersectionObserver';

describe('<ScrollContext/>', () => {
  let wrapper: ReactWrapper;

  function expectTextFromClassName(className: string, value: string | number | boolean | null) {
    const actual = wrapper.find(`.${className}`).text();
    const message = `Expected text for element with class .${className} to be ${value} instead of ${actual}`;
    expect(actual).equals(`${value}`, message);
  }

  function UseContext({ children }: any) {
    const contextProps = useScrollContextProps();
    return <ScrollContext.Provider value={contextProps}>{children}</ScrollContext.Provider>;
  }

  let _setScrollRoot: (root: Nullable<Element>) => any;
  let _resetScrollObservers: () => any;
  let _isOutlineTargetVisible: (dest: NodeDestination) => boolean;
  let _isPageVisible: (opts: { pageNumber?: number; pageIndex?: number }) => boolean;

  beforeEach(() => {
    (global as any).IntersectionObserver = function (...args) {
      const inst = new MockIntersectionObserver(...args);
      return inst;
    };

    wrapper = mount(
      <div>
        <UseContext>
          <ScrollContext.Consumer>
            {(args: IScrollContext) => {
              const {
                scrollDirection,
                visibleOutlineTargets,
                visiblePageNumbers,
                setScrollRoot,
                resetScrollObservers,
                isOutlineTargetVisible,
                isPageVisible,
              } = args;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _setScrollRoot = setScrollRoot;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _resetScrollObservers = resetScrollObservers;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _isOutlineTargetVisible = isOutlineTargetVisible;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _isPageVisible = isPageVisible;
              return (
                <div>
                  <div className="scrollDirection">{scrollDirection}</div>
                  <div className="visibleOutlineTargets">{visibleOutlineTargets}</div>
                  <div className="visiblePageNumbers">{visiblePageNumbers}</div>
                </div>
              );
            }}
          </ScrollContext.Consumer>
        </UseContext>
      </div>
    );
  });

  afterEach(() => {
    (global as any).IntersectionObserver = undefined;
    wrapper.unmount();
  });

  it('provides a default scroll direction', () => {
    expectTextFromClassName('scrollDirection', '');
  });

  it('provides a default visible outline targets', () => {
    expectTextFromClassName('visibleOutlineTargets', '');
  });

  it('provides a default visible page numbers', () => {
    expectTextFromClassName('visiblePageNumbers', '');
  });
});
