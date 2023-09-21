export interface MediaEntity {
  id: string;
  createdAt: Date;
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
  updatedAt: Date;
  height?: number;
  width?: number;
}
