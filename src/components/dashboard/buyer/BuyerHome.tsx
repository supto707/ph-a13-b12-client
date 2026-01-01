import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ClipboardList, Clock, Coins, CheckCircle, XCircle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const mockSubmissions = [
  { id: 1, workerName: 'John Worker', taskTitle: 'Watch YouTube Video', payableAmount: 10, submissionDetails: 'I watched the full video and left a comment. Screenshot: https://example.com/proof.jpg', status: 'pending' },
  { id: 2, workerName: 'Jane Doe', taskTitle: 'Complete Survey', payableAmount: 15, submissionDetails: 'Survey completed successfully. Response ID: SR-12345', status: 'pending' },
  { id: 3, workerName: 'Mike Smith', taskTitle: 'App Review', payableAmount: 20, submissionDetails: 'Posted 5-star review with detailed feedback. Username: mikesmith123', status: 'pending' },
];

const BuyerHome = () => {
  const { user, updateUserCoins } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock stats
  const stats = {
    totalTasks: 15,
    pendingTasks: 120,
    totalPayments: 2500,
  };

  const handleApprove = (submissionId: number) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      setSubmissions(submissions.filter(s => s.id !== submissionId));
      toast({
        title: 'Submission Approved',
        description: `Payment of ${submission.payableAmount} coins sent to ${submission.workerName}`,
      });
    }
    setIsModalOpen(false);
  };

  const handleReject = (submissionId: number) => {
    setSubmissions(submissions.filter(s => s.id !== submissionId));
    toast({
      title: 'Submission Rejected',
      description: 'The worker has been notified',
      variant: 'destructive',
    });
    setIsModalOpen(false);
  };

  const openModal = (submission: typeof mockSubmissions[0]) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Manage your tasks and review submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <ClipboardList className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalTasks}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Workers</CardTitle>
            <Clock className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.pendingTasks}</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Paid</CardTitle>
            <Coins className="w-5 h-5 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary-foreground">{stats.totalPayments} Coins</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks to Review */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Tasks to Review</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Worker</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Task Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">{submission.workerName}</td>
                      <td className="py-3 px-4 text-foreground">{submission.taskTitle}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Coins className="w-4 h-4 text-accent" />
                          {submission.payableAmount}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openModal(submission)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="success" onClick={() => handleApprove(submission.id)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(submission.id)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending submissions to review</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Worker</p>
                <p className="font-medium">{selectedSubmission.workerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Task</p>
                <p className="font-medium">{selectedSubmission.taskTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submission Details</p>
                <p className="text-foreground bg-secondary p-3 rounded-lg mt-1">
                  {selectedSubmission.submissionDetails}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" variant="success" onClick={() => handleApprove(selectedSubmission.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button className="flex-1" variant="destructive" onClick={() => handleReject(selectedSubmission.id)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerHome;
