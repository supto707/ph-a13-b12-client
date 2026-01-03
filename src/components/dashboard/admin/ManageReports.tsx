import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { reportAPI } from '@/lib/api';
import { AlertTriangle, CheckCircle, XCircle, Loader2, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const ManageReports = () => {
    const { toast } = useToast();
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await reportAPI.getAll();
                setReports(response.data);
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: string, status: 'resolved' | 'dismissed') => {
        setProcessingId(reportId);
        try {
            await reportAPI.updateStatus(reportId, status);
            setReports(reports.map(r => r._id === reportId ? { ...r, status } : r));
            toast({
                title: 'Report Updated',
                description: `Report marked as ${status}`,
            });
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Failed to update report:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to update report',
                variant: 'destructive',
            });
        } finally {
            setProcessingId(null);
        }
    };

    const openModal = (report: any) => {
        setSelectedReport(report);
        setIsModalOpen(true);
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
                <h1 className="font-display text-2xl font-bold text-foreground">Manage Reports</h1>
                <p className="text-muted-foreground">Review and act on reported submissions</p>
            </div>

            <Card className="shadow-soft">
                <CardHeader>
                    <CardTitle className="font-display">Platform Reports ({reports.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {reports.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No reports found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reporter</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Task</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report._id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-foreground">{report.reportedByName}</td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {report.reason}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground line-clamp-1 max-w-[200px]">
                                                {report.submissionId?.taskTitle || 'N/A'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${report.status === 'pending' ? 'bg-accent/10 text-accent' :
                                                        report.status === 'resolved' ? 'bg-success/10 text-success' :
                                                            'bg-muted text-muted-foreground'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Button size="sm" variant="outline" onClick={() => openModal(report)}>
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Reporter</p>
                                    <p className="font-medium">{selectedReport.reportedByName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Reason</p>
                                    <p className="font-medium text-orange-600">{selectedReport.reason}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Details Provided</p>
                                <p className="text-sm bg-secondary p-3 rounded-lg">{selectedReport.details}</p>
                            </div>

                            {selectedReport.submissionId && (
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
                                        <h4 className="text-sm font-semibold">Reported Submission</h4>
                                        <span className="text-xs text-muted-foreground">Original Task: {selectedReport.submissionId.taskTitle}</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="grid grid-cols-2 text-sm">
                                            <span className="text-muted-foreground">Worker:</span>
                                            <span className="font-medium">{selectedReport.submissionId.workerName}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Worker Proof:</p>
                                            <p className="text-sm bg-background border p-2 rounded italic">
                                                "{selectedReport.submissionId.submissionDetails}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleUpdateStatus(selectedReport._id, 'dismissed')}
                                    disabled={processingId === selectedReport._id || selectedReport.status !== 'pending'}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Dismiss Report
                                </Button>
                                <Button
                                    className="flex-1 bg-success hover:bg-success/90"
                                    onClick={() => handleUpdateStatus(selectedReport._id, 'resolved')}
                                    disabled={processingId === selectedReport._id || selectedReport.status !== 'pending'}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Resolved
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageReports;
