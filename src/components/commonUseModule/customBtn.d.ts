import * as React from 'react';
export interface IGCustomBtnProps {
  type?: string;
  style: React.CSSProperties;
  onClick?: React.MouseEventHandler<any>;
}

export default class OptButton extends React.Component<IGCustomBtnProps, any> {}