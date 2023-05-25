import * as React from 'react';

import { POSITION, PositionType } from '../marker/ArrowFlagBase';

type Props = {
  children?: React.ReactNode;
  className?: string;
  headerPosition?: PositionType;
};

export const IconFlag: React.FunctionComponent<Props> = ({
  children,
  className,
  headerPosition = POSITION.LEFT,
}: Props) => {
  if (headerPosition == POSITION.LEFT) {
    return (
      <svg viewBox="0 0 75 22" className={className}>
        <path d="M64.5203 20.8331L64.52 20.8334C64.0669 21.2535 63.4743 21.491 62.8565 21.5H3C2.33696 21.5 1.70107 21.2366 1.23223 20.7678C0.763392 20.2989 0.5 19.663 0.5 19V3C0.5 2.33696 0.763392 1.70107 1.23223 1.23223C1.70107 0.763391 2.33696 0.5 3 0.5H62.7765C63.3943 0.508999 63.9869 0.746454 64.44 1.16662L64.4403 1.16688L73.0803 9.16688L73.0802 9.16694L73.0869 9.17284C73.3436 9.40224 73.5502 9.6822 73.6937 9.99518C73.8372 10.3082 73.9145 10.6474 73.9207 10.9916C73.927 11.3359 73.862 11.6777 73.73 11.9957C73.5986 12.3123 73.4035 12.5984 73.1568 12.8364C73.1557 12.8374 73.1546 12.8385 73.1535 12.8395L64.5203 20.8331Z" />
        {children}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 75 22" className={className}>
      <path d="M9.90061 1.16688L9.90088 1.16662C10.354 0.746447 10.9466 0.508993 11.5644 0.499998L71.4209 0.500004C72.0839 0.500004 72.7198 0.763395 73.1887 1.23223C73.6575 1.70107 73.9209 2.33696 73.9209 3L73.9209 19C73.9209 19.663 73.6575 20.2989 73.1887 20.7678C72.7198 21.2366 72.0839 21.5 71.4209 21.5L11.6444 21.5C11.0266 21.491 10.434 21.2535 9.98088 20.8334L9.98061 20.8331L1.34061 12.8331L1.34066 12.8331L1.33405 12.8272C1.07732 12.5977 0.870728 12.3178 0.727235 12.0048C0.583749 11.6918 0.506448 11.3526 0.500192 11.0084C0.493936 10.6641 0.558854 10.3223 0.690866 10.0043C0.822305 9.68773 1.01744 9.40156 1.26415 9.1636C1.26522 9.16256 1.26631 9.16152 1.26738 9.16048L9.90061 1.16688Z" />
      {children}
    </svg>
  );
};
