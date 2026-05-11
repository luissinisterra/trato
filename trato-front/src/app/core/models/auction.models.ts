export interface Auction {
  id: number;
  productId: number;
  sellerId: number;
  startPrice: number;
  currentPrice: number;
  minIncrement: number;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Bid {
  id: number;
  auctionId: number;
  userId: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuctionPayload {
  productId: number;
  sellerId: number;
  startPrice: number;
  minIncrement: number;
  startTime: string;
  endTime: string;
}

export interface CreateBidPayload {
  auctionId: number;
  userId: number;
  amount: number;
}

export interface UpdateBidPayload {
  amount: number;
}
