import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { statsAPI, withdrawalAPI } from '@/lib/api';
import { Users, Briefcase, Coins, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Withdrawal } from '@/types';

interface AdminStats {
  totalWorkers: number;
  totalBuyers: number;
  totalCoins: number;
  totalPayments: number;
}

const AdminHome = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalWorkers: 0, totalBuyers: 0, totalCoins: 0, totalPayments: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, withdrawalsRes] = await Promise.all([
          statsAPI.getAdmin(),
          withdrawalAPI.getPending()
        ]);
        setStats(statsRes.data);
        setWithdrawals(withdrawalsRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    setProcessingId(withdrawalId);
    try {
      await withdrawalAPI.approve(withdrawalId);
      setWithdrawals(withdrawals.filter(w => w._id !== withdrawalId));
      toast({
        title: 'Withdrawal Approved',
        description: 'The withdrawal has been processed successfully.',
      });
    } catch (error: unknown) {
      console.error('Failed to approve withdrawal:', error);
      toast({
        title: 'Error',
        description: (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to approve withdrawal',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workers</CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalWorkers.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Buyers</CardTitle>
            <Briefcase className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalBuyers.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Coins</CardTitle>
            <Coins className="w-5 h-5 text-success" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalCoins.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Payments</CardTitle>
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary-foreground">${stats.totalPayments.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Requests */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Pending Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Worker</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Coins</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal._id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{withdrawal.workerName}</p>
                          <p className="text-xs text-muted-foreground">{withdrawal.workerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Coins className="w-4 h-4 text-accent" />
                          {withdrawal.withdrawalCoin}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">${withdrawal.withdrawalAmount}</td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">{withdrawal.paymentSystem}</td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 gap-1"
                          onClick={() => handleApproveWithdrawal(withdrawal._id)}
                          disabled={processingId === withdrawal._id}
                        >
                          {processingId === withdrawal._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending withdrawal requests</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
