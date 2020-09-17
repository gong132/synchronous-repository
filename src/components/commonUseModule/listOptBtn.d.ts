import * as React from 'react';
export interface IGListOptBtn {
  style?: React.CSSProperties;
  title: string;
  icon: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<any>;
}

export default class OptButton extends React.Component<IGListOptBtn, any> {}
