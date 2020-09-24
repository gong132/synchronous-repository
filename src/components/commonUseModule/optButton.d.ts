import * as React from 'react';

export interface IGOptButtonProps {
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  text: React.ReactNode;
  icon?: string;
  img?: string;
  disabled?: boolean;
  showText?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<any>;
}

export default class OptButton extends React.Component<IGOptButtonProps, any> {}
