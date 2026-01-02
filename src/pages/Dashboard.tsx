import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WorkerHome from '@/components/dashboard/worker/WorkerHome';
import TaskList from '@/components/dashboard/worker/TaskList';
import TaskDetails from '@/components/dashboard/worker/TaskDetails';
import MySubmissions from '@/components/dashboard/worker/MySubmissions';
import Withdrawals from '@/components/dashboard/worker/Withdrawals';
import BuyerHome from '@/components/dashboard/buyer/BuyerHome';
import AddTask from '@/components/dashboard/buyer/AddTask';
import MyTasks from '@/components/dashboard/buyer/MyTasks';
import PurchaseCoins from '@/components/dashboard/buyer/PurchaseCoins';
import PaymentHistory from '@/components/dashboard/buyer/PaymentHistory';
import AdminHome from '@/components/dashboard/admin/AdminHome';
import ManageUsers from '@/components/dashboard/admin/ManageUsers';
import ManageTasks from '@/components/dashboard/admin/ManageTasks';
import Profile from '@/components/dashboard/Profile';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getDefaultRoute = () => {
    switch (user.role) {
      case 'worker':
        return '/dashboard/worker-home';
      case 'buyer':
        return '/dashboard/buyer-home';
      case 'admin':
        return '/dashboard/admin-home';
      default:
        return '/dashboard/worker-home';
    }
  };

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Profile Route */}
        <Route path="profile" element={<Profile />} />

        {/* Worker Routes */}
        <Route path="worker-home" element={<WorkerHome />} />
        <Route path="task-list" element={<TaskList />} />
        <Route path="task/:id" element={<TaskDetails />} />
        <Route path="my-submissions" element={<MySubmissions />} />
        <Route path="withdrawals" element={<Withdrawals />} />

        {/* Buyer Routes */}
        <Route path="buyer-home" element={<BuyerHome />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="my-tasks" element={<MyTasks />} />
        <Route path="purchase-coins" element={<PurchaseCoins />} />
        <Route path="payment-history" element={<PaymentHistory />} />

        {/* Admin Routes */}
        <Route path="admin-home" element={<AdminHome />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-tasks" element={<ManageTasks />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
