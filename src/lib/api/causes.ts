export interface Cause {
  title: string | undefined;
  description?: string;
  imageUrl?: string;
  wallet?: string;
  deletedAt?: string | null;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CausePostBody {
  title?: string | undefined;
  description?: string | undefined;
  wallet?: string | undefined;
  imageUrl?: string | undefined;
}
