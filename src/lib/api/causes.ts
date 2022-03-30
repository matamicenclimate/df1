export interface Cause {
  title: string;
  description: string;
  imageUrl: string;
  wallet: string;
  deletedAt: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CausePostBody {
  title: string;
  description: string;
  wallet: string;
  imageUrl: string;
}
