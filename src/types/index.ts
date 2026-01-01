export type UserRole = 'worker' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: UserRole;
  coins: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  detail: string;
  requiredWorkers: number;
  payableAmount: number;
  completionDate: Date;
  submissionInfo: string;
  imageUrl: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  createdAt: Date;
}

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  payableAmount: number;
  workerEmail: string;
  workerName: string;
  buyerName: string;
  buyerEmail: string;
  submissionDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export interface Withdrawal {
  id: string;
  workerEmail: string;
  workerName: string;
  withdrawalCoin: number;
  withdrawalAmount: number;
  paymentSystem: string;
  accountNumber: string;
  status: 'pending' | 'approved';
  createdAt: Date;
}

export interface Payment {
  id: string;
  buyerEmail: string;
  buyerName: string;
  coinsPurchased: number;
  amountPaid: number;
  paymentDate: Date;
}

export interface Notification {
  id: string;
  message: string;
  toEmail: string;
  actionRoute: string;
  createdAt: Date;
  read: boolean;
}
