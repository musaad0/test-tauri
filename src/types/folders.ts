export interface IFile {
  name: string;
  path: string;
}

export interface IFolder {
  name: string;
  path: string;
  id: string;
  files: IFile[];
}
