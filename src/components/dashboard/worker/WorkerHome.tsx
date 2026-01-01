import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { statsAPI, submissionAPI } from '@/lib/api';
import { ClipboardCheck, Clock, Coins, Loader2 } from 'lucide-react';
import { Submission } from '@/types';

interface WorkerStats {
  totalSubmissions: number;
  pendingSubmissions: number;
  totalEarnings: number;
}

const WorkerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<WorkerStats>({ totalSubmissions: 0, pendingSubmissions: 0, totalEarnings: 0 });
  const [approvedSubmissions, setApprovedSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, submissionsRes] = await Promise.all([
          statsAPI.getWorker(),
          submissionAPI.getWorkerApproved()
        ]);
        setStats(statsRes.data);
        setApprovedSubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Failed to fetch worker data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h1 className="font-display text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's your earning overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <ClipboardCheck className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalSubmissions}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Submissions</CardTitle>
            <Clock className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.pendingSubmissions}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Earnings</CardTitle>
            <Coins className="w-5 h-5 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary-foreground">{stats.totalEarnings} Coins</p>
          </CardContent>
        </Card>
      </div>

      {/* Approved Submissions Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Approved Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {approvedSubmissions.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No approved submissions yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Task Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payable Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Buyer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">{submission.taskTitle}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Coins className="w-4 h-4 text-accent" />
                          {submission.payableAmount}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">{submission.buyerName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          {submission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerHome;
