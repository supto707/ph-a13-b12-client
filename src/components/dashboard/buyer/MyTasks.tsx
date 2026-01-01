import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins, Calendar, Users, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const mockTasks = [
  { id: '1', title: 'Watch YouTube Video', detail: 'Watch and comment on video', requiredWorkers: 50, payableAmount: 10, completionDate: new Date('2024-02-15'), submissionInfo: 'Screenshot required' },
  { id: '2', title: 'Complete Survey', detail: 'Fill out customer survey', requiredWorkers: 100, payableAmount: 15, completionDate: new Date('2024-02-20'), submissionInfo: 'Response ID required' },
  { id: '3', title: 'App Download & Review', detail: 'Download app and leave review', requiredWorkers: 30, payableAmount: 25, completionDate: new Date('2024-02-18'), submissionInfo: 'Screenshot of review' },
];

const MyTasks = () => {
  const { user, updateUserCoins } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState(mockTasks);
  const [editingTask, setEditingTask] = useState<typeof mockTasks[0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleEdit = (task: typeof mockTasks[0]) => {
    setEditingTask({ ...task });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
      toast({
        title: 'Task Updated',
        description: 'Your task has been updated successfully.',
      });
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const refund = task.requiredWorkers * task.payableAmount;
      updateUserCoins((user?.coins || 0) + refund);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast({
        title: 'Task Deleted',
        description: `Task deleted and ${refund} coins have been refunded.`,
      });
    }
  };

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
                          <Button size="sm" variant="outline" onClick={() => handleEdit(task)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(task.id)}>
                            <Trash2 className="w-4 h-4" />
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
              <Button className="w-full" onClick={handleSaveEdit}>
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
