import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { statsAPI, submissionAPI, reportAPI } from '@/lib/api';
import { ClipboardList, Clock, Coins, CheckCircle, XCircle, Eye, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Submission } from '@/types';

interface BuyerStats {
  totalTasks: number;
  pendingTasks: number;
  totalPayment: number;
}

const BuyerHome = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [stats, setStats] = useState<BuyerStats>({ totalTasks: 0, pendingTasks: 0, totalPayment: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Report Form State
  const [reportData, setReportData] = useState({
    reason: '',
    details: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, submissionsRes] = await Promise.all([
          statsAPI.getBuyer(),
          submissionAPI.getBuyerSubmissions()
        ]);
        setStats(statsRes.data);
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Failed to fetch buyer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (submissionId: string) => {
    setProcessingId(submissionId);
    try {
      await submissionAPI.approve(submissionId);

      const submission = submissions.find(s => s._id === submissionId);
      setSubmissions(submissions.filter(s => s._id !== submissionId));

      toast({
        title: 'Submission Approved',
        description: `Payment of ${submission?.payableAmount} coins sent to ${submission?.workerName}`,
      });

      await refreshUser();
    } catch (error: unknown) {
      console.error('Failed to approve:', error);
      toast({
        title: 'Error',
        description: (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to approve submission',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
      setIsModalOpen(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    setProcessingId(submissionId);
    try {
      await submissionAPI.reject(submissionId);

      setSubmissions(submissions.filter(s => s._id !== submissionId));

      toast({
        title: 'Submission Rejected',
        description: 'The worker has been notified',
        variant: 'destructive',
      });
    } catch (error: unknown) {
      console.error('Failed to reject:', error);
      toast({
        title: 'Error',
        description: (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to reject submission',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
      setIsModalOpen(false);
    }
  };

  const handleReport = async () => {
    if (!selectedSubmission || !reportData.reason || !reportData.details) {
      toast({
        title: 'Error',
        description: 'Please fill in all report details',
        variant: 'destructive'
      });
      return;
    }

    setProcessingId(selectedSubmission._id);
    try {
      await reportAPI.create({
        submissionId: selectedSubmission._id,
        reason: reportData.reason,
        details: reportData.details
      });

      toast({
        title: 'Report Submitted',
        description: 'Admin will review this submission soon.'
      });

      setIsReportModalOpen(false);
      setReportData({ reason: '', details: '' });
    } catch (error: any) {
      console.error('Failed to submit report:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to submit report',
        variant: 'destructive'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const openReportModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsReportModalOpen(true);
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
            <p className="text-3xl font-bold text-primary-foreground">{stats.totalPayment} Coins</p>
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
                    <tr key={submission._id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-500 border-orange-200 hover:bg-orange-50"
                            onClick={() => openReportModal(submission)}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(submission._id)}
                            disabled={processingId === submission._id}
                          >
                            {processingId === submission._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(submission._id)}
                            disabled={processingId === submission._id}
                          >
                            {processingId === submission._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
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
                <p className="text-foreground bg-secondary p-3 rounded-lg mt-1 whitespace-pre-wrap">
                  {selectedSubmission.submissionDetails}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedSubmission._id)}
                  disabled={processingId === selectedSubmission._id}
                >
                  {processingId === selectedSubmission._id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => handleReject(selectedSubmission._id)}
                  disabled={processingId === selectedSubmission._id}
                >
                  {processingId === selectedSubmission._id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Report Submission
            </DialogTitle>
            <DialogDescription>
              Reporting a submission will alert the Admin to review it for potential fraud or spam.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Report</Label>
              <Select
                value={reportData.reason}
                onValueChange={(val) => setReportData({ ...reportData, reason: val })}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Incorrect Work">Incorrect Work</SelectItem>
                  <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea
                id="details"
                placeholder="Provide more information about why you're reporting this submission..."
                value={reportData.details}
                onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsReportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleReport}
              disabled={processingId === selectedSubmission?._id || !reportData.reason || !reportData.details}
            >
              {processingId === selectedSubmission?._id ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerHome;
