export interface SocialAuthor {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface LookSlide {
  slot: string;
  title: string;
  imageUrl?: string | null;
}

export interface LookCard {
  id: string;
  title: string;
  caption?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  coverUrl?: string | null;
  slides?: LookSlide[];
  itemCount: number;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  isMine?: boolean;
  isFollowingAuthor?: boolean;
  comments?: LookComment[];
  author: SocialAuthor;
}

export interface LookComment {
  id: string;
  body: string;
  createdAt: string;
  author: SocialAuthor;
}

export interface PublicLookItem {
  id: string;
  slot: string;
  title: string;
  brand?: string | null;
  imageUrl?: string | null;
  productId?: string | null;
  variantId?: string | null;
  source?: string | null;
  handoverUrl?: string | null;
  shoppable: boolean;
}

export interface PublicLook extends LookCard {
  isMine: boolean;
  isFollowingAuthor: boolean;
  items: PublicLookItem[];
  comments: LookComment[];
}

export interface SocialProfile {
  user: SocialAuthor & { bio?: string | null; email?: string | null };
  shop: { id: string; slug: string; businessName: string } | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isMe: boolean;
  looks: LookCard[];
}

export interface FeedResponse {
  tab: "following" | "explore";
  fallback: boolean;
  looks: LookCard[];
}

export interface ShopProfile {
  shop: {
    id: string;
    slug: string;
    businessName: string;
    productCount: number;
  };
  followerCount: number;
  isFollowing: boolean;
  products: unknown[];
}
