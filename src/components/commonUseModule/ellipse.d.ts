import * as React from 'react';
text, className, style, onClick
export interface IGEllipsesProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler<any>;
}

export default class OptButton extends React.Component<IGEllipsesProps, any> {}
