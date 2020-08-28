import * as React from 'react';
export interface IGlobalSandBoxProps {
  sandboxStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  img?: string;
  title?: string;
}

export default class GlobalSandBox extends React.Component<IGlobalSandBoxProps, any> {}
