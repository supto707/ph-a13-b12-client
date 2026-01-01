import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockSubmissions = [
  { id: 1, taskTitle: 'Watch YouTube Video', payableAmount: 10, buyerName: 'Sarah Buyer', submittedAt: new Date('2024-01-28'), status: 'approved' },
  { id: 2, taskTitle: 'Complete Survey', payableAmount: 15, buyerName: 'John Smith', submittedAt: new Date('2024-01-27'), status: 'pending' },
  { id: 3, taskTitle: 'App Review', payableAmount: 20, buyerName: 'Mike Johnson', submittedAt: new Date('2024-01-26'), status: 'approved' },
  { id: 4, taskTitle: 'Social Media Follow', payableAmount: 5, buyerName: 'Lisa Brown', submittedAt: new Date('2024-01-25'), status: 'rejected' },
  { id: 5, taskTitle: 'Website Testing', payableAmount: 30, buyerName: 'Tom Wilson', submittedAt: new Date('2024-01-24'), status: 'pending' },
  { id: 6, taskTitle: 'Data Entry', payableAmount: 20, buyerName: 'Emily Davis', submittedAt: new Date('2024-01-23'), status: 'approved' },
];

const MySubmissions = () => {
  const { user } = useAuth();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-accent" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-accent/10 text-accent';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Submissions</h1>
        <p className="text-muted-foreground">Track all your task submissions</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Task Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Buyer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{submission.taskTitle}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-foreground">
                        <Coins className="w-4 h-4 text-accent" />
                        {submission.payableAmount}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{submission.buyerName}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.submittedAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        {submission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MySubmissions;
