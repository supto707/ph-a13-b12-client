import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { taskAPI, submissionAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Coins, Calendar, Users, User, ArrowLeft, Loader2, Send, FileText } from 'lucide-react';
import { Task } from '@/types';

const TaskDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionDetails, setSubmissionDetails] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            try {
                const response = await taskAPI.getById(id);
                setTask(response.data);
            } catch (error) {
                console.error('Failed to fetch task:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load task details',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [id, toast]);

    const handleSubmit = async () => {
        if (!task || !submissionDetails.trim()) {
            toast({
                title: 'Error',
                description: 'Please provide submission details',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await submissionAPI.create({
                taskId: task.id,
                submissionDetails: submissionDetails.trim(),
            });

            toast({
                title: 'Success!',
                description: 'Your submission has been sent for review',
            });

            await refreshUser();
            navigate('/dashboard/my-submissions');
        } catch (error: any) {
            console.error('Failed to submit:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to submit task',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!task) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Task not found</p>
                <Button onClick={() => navigate('/dashboard/task-list')} className="mt-4">
                    Back to Tasks
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <Button
                variant="ghost"
                onClick={() => navigate('/dashboard/task-list')}
                className="gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Tasks
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-soft overflow-hidden">
                        {task.imageUrl && (
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={task.imageUrl}
                                    alt={task.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-display text-2xl">{task.title}</CardTitle>
                                <div className="coin-badge text-lg">
                                    <Coins className="w-4 h-4" />
                                    {task.payableAmount}
                                </div>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Posted by {task.buyerName}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <div>
                                        <p className="text-xs">Deadline</p>
                                        <p className="text-foreground font-medium">{formatDate(task.completionDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-5 h-5" />
                                    <div>
                                        <p className="text-xs">Available Slots</p>
                                        <p className="text-foreground font-medium">{task.requiredWorkers}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Task Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{task.detail}</p>
                            </div>

                            <div className="p-4 bg-secondary/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">What to Submit</h3>
                                </div>
                                <p className="text-muted-foreground">{task.submissionInfo}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submission Form */}
                <div className="lg:col-span-1">
                    <Card className="shadow-soft sticky top-6">
                        <CardHeader>
                            <CardTitle className="font-display">Submit Your Work</CardTitle>
                            <CardDescription>
                                Complete the task and submit your proof
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {task.requiredWorkers <= 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-muted-foreground">
                                        This task has reached its maximum number of workers.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="submission">Submission Details</Label>
                                        <Textarea
                                            id="submission"
                                            placeholder="Provide your proof of work (screenshot link, description, etc.)"
                                            value={submissionDetails}
                                            onChange={(e) => setSubmissionDetails(e.target.value)}
                                            rows={6}
                                        />
                                    </div>

                                    <div className="p-4 bg-primary/10 rounded-lg">
                                        <p className="text-sm text-center">
                                            You will earn <span className="font-bold text-primary">{task.payableAmount} coins</span> upon approval
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full gap-2"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !submissionDetails.trim()}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        {isSubmitting ? 'Submitting...' : 'Submit Work'}
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
