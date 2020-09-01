import * as React from 'react';
export interface ILoginItemProps {
  rowKey: string | Function;
  columns: Array;
  data: object;
  loading: boolean;
  scroll?: object;
  showHeader: boolean;
  size?: 'default' | 'middle' | 'small';
  title?: Function;
  selectedRowKeys?: Array;
  onSelectedRow?: Function;
  onChange?: Function;
  onExpand?: Function;
  onExpandedRowsChange?: Function;
  onHeaderRow?: Function;
  onRow?: Function;
  getPopupContainer?: Function;
  style?: React.CSSProperties;
  tableLayout?: string;
  bordered?: boolean;
  childrenColumnName?: string[];
  components?: React.ReactNode;
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: string[];
  expandedRowKeys?: string[];
  expandedRowRender?: Function;
  expandIcon?: React.ReactNode;
  expandRowByClick?: boolean;
  expandIconColumnIndex?: number;
  footer?: Function;
  indentSize?: number;
  locale?: object;
  pagination?: object;
  rowClassName?: Function | string;

}

export class StandardTable extends React.Component<ILoginItemProps, any> {}
