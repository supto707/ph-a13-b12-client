import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { taskAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Calendar, Users, Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';

const MyTasks = () => {
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskAPI.getBuyerTasks();
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleEdit = (task: Task) => {
    setEditingTask({ ...task });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    setProcessingId(editingTask.id);
    try {
      await taskAPI.update(editingTask.id, {
        title: editingTask.title,
        detail: editingTask.detail,
        submissionInfo: editingTask.submissionInfo,
      });

      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
      toast({
        title: 'Task Updated',
        description: 'Your task has been updated successfully.',
      });
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error('Failed to update task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update task',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? You will receive a refund for remaining workers.')) {
      return;
    }

    setProcessingId(taskId);
    try {
      const response = await taskAPI.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      await refreshUser();

      toast({
        title: 'Task Deleted',
        description: `Task deleted and ${response.data.refundedCoins} coins have been refunded.`,
      });
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete task',
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
        <h1 className="font-display text-2xl font-bold text-foreground">My Tasks</h1>
        <p className="text-muted-foreground">Manage your posted tasks</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Task List</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Workers</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Deadline</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{task.title}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {task.requiredWorkers}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Coins className="w-4 h-4 text-accent" />
                          {task.payableAmount}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(task.completionDate)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(task)}
                            disabled={processingId === task.id}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(task.id)}
                            disabled={processingId === task.id}
                          >
                            {processingId === task.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
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
              <p className="text-muted-foreground">You haven't created any tasks yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-detail">Detail</Label>
                <Textarea
                  id="edit-detail"
                  value={editingTask.detail}
                  onChange={(e) => setEditingTask({ ...editingTask, detail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-submission">Submission Info</Label>
                <Textarea
                  id="edit-submission"
                  value={editingTask.submissionInfo}
                  onChange={(e) => setEditingTask({ ...editingTask, submissionInfo: e.target.value })}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSaveEdit}
                disabled={processingId === editingTask.id}
              >
                {processingId === editingTask.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTasks;
