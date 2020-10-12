import * as React from 'react';
export interface IBarProps {
  title: string;
  barColor?: Array;
  cusConfig?: object;
}

export default class Bar extends React.Component<IBarProps, any> {}
