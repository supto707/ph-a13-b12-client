export type UserRole = 'worker' | 'buyer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: UserRole;
  coins: number;
  createdAt: Date;
}

export interface Task {
  _id: string;
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
  _id: string;
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
  _id: string;
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
  _id: string;
  buyerEmail: string;
  buyerName: string;
  coinsPurchased: number;
  amountPaid: number;
  paymentDate: Date;
}

export interface Notification {
  _id: string;
  message: string;
  toEmail: string;
  actionRoute: string;
  createdAt: Date;
  read: boolean;
}
