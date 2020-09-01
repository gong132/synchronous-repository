import * as React from 'react';
export interface IGOptButtonProps {
  style?: React.CSSProperties;
  text: React.ReactNode;
  icon?: string;
  img?: string;
  onClick?: React.MouseEventHandler<any>;
}

export default class OptButton extends React.Component<IGOptButtonProps, any> {}