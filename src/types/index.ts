import { Book, User } from '@prisma/client';

export type BookWithOwner = Book & {
  owner: Pick<User, 'id' | 'name' | 'email' | 'mobileNumber'>;
};

export type UserRole = 'owner' | 'seeker';

export type BookStatus = 'available' | 'rented' | 'exchanged';

export type BookCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';

export type BookFormData = {
  title: string;
  author: string;
  genre?: string;
  description?: string;
  location: string;
  contactInfo: string;
  condition?: BookCondition;
  coverImage?: string;
};
