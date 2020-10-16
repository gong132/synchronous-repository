import * as React from 'react';
export interface FileUpload {
  uploadType: string;
  urls: string;
  linkId: string;
  handleSaveFileUrl: React.EventHandler<T>;
}

export default class FileUploadNo extends React.Component<FileUpload, any> {}