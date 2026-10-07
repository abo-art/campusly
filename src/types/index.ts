export type ListingCategory =
  | 'All'
  | 'Books'
  | 'Tech'
  | 'Clothing'
  | 'Furniture'
  | 'Services'
  | 'Other';

export interface CampusUser {
  id: string;
  name: string;
  email: string;
  avatarURL?: string;
  createdAt: string | Date;
  favoriteEvents?: string[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  sellerId: string;
  sellerName: string;
  imageURL?: string;
  createdAt: any;
  isSold?: boolean;
}

export type JobCategory =
  | 'All'
  | 'Tutoring'
  | 'Delivery'
  | 'Design'
  | 'IT'
  | 'Marketing'
  | 'Other';

export interface Job {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  category: JobCategory;
  posterName: string;
  posterId: string;
  createdAt: any;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: any;
  time: string;
  location: string;
  imageURL?: string;
  organizerId: string;
  organizerName: string;
  createdAt: any;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: any;
  listingId?: string;
  listingTitle?: string;
  otherUserName?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: any;
}
