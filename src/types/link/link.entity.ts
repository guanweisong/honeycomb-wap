import { LinkStatus } from './LinkStatus';

export interface LinkEntity {
  id: string;
  url: string;
  name: string;
  logo: string;
  description: string;
  status: LinkStatus;
  createdAt: string;
  updatedAt: string;
}
