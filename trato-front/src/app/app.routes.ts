import { Routes } from '@angular/router';
import { HomePage } from './features/home/home.page';
import { AuthPage } from './features/auth/auth.page';
import { ExplorePage } from './features/explore/explore.page';
import { AuctionDetailPage } from './features/auctions/auction-detail.page';
import { BidPage } from './features/bids/bid.page';
import { ProfilePage } from './features/profile/profile.page';
import { MyAuctionsPage } from './features/my-auctions/my-auctions.page';
import { HistoryPage } from './features/history/history.page';
import { PaymentsPage } from './features/payments/payments.page';
import { NotificationsPage } from './features/notifications/notifications.page';
import { CreateAuctionPage } from './features/auctions/create-auction.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: AuthPage },
  { path: 'register', component: AuthPage },
  { path: 'explore', component: ExplorePage },
  { path: 'auction/:id', component: AuctionDetailPage },
  { path: 'create-auction', component: CreateAuctionPage },
  { path: 'bids', component: BidPage },
  { path: 'profile', component: ProfilePage },
  { path: 'my-auctions', component: MyAuctionsPage },
  { path: 'history', component: HistoryPage },
  { path: 'wallet', component: PaymentsPage },
  { path: 'notifications', component: NotificationsPage },
  { path: '**', redirectTo: '' },
];
