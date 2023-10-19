export enum UpdateType {
  Post = 'Post',
  Page = 'page',
}

export interface UpdateView {
  type: UpdateType;
  id: string;
}
