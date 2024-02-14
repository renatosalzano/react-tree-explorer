import { FC, ReactNode } from 'react';

import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const AngleDown = (): ReactNode => {
  return <FontAwesomeIcon className="expand-icon" icon={faAngleDown} />
}

export const AngleRight = (): ReactNode => {
  return <FontAwesomeIcon className="expand-icon" icon={faAngleRight} />
}