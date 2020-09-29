import * as React from 'react';
export interface ILineProps {
  title: React.ReactNode;
  color?: string;
  padding?: [number, number, number, number];
  height: number;
  data: Array<{
    x: string;
    y: number;
  }>;
  cols: object,
  style?: React.CSSProperties;
}

export default class Line extends React.Component<ILineProps, any> {}
