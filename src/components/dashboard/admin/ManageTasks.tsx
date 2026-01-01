import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Calendar, Users, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockTasks = [
  { id: '1', title: 'Watch YouTube Video', buyerName: 'Sarah Buyer', requiredWorkers: 50, payableAmount: 10, completionDate: new Date('2024-02-15') },
  { id: '2', title: 'Complete Survey', buyerName: 'John Smith', requiredWorkers: 100, payableAmount: 15, completionDate: new Date('2024-02-20') },
  { id: '3', title: 'App Download & Review', buyerName: 'Mike Johnson', requiredWorkers: 30, payableAmount: 25, completionDate: new Date('2024-02-18') },
  { id: '4', title: 'Social Media Follow', buyerName: 'Lisa Brown', requiredWorkers: 200, payableAmount: 5, completionDate: new Date('2024-02-25') },
  { id: '5', title: 'Website Testing', buyerName: 'Tom Wilson', requiredWorkers: 20, payableAmount: 30, completionDate: new Date('2024-02-22') },
];

const ManageTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState(mockTasks);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    toast({
      title: 'Task Deleted',
      description: 'The task has been removed from the platform',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Manage Tasks</h1>
        <p className="text-muted-foreground">View and manage all platform tasks</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">All Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Buyer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Workers</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Deadline</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{task.title}</td>
                    <td className="py-3 px-4 text-muted-foreground">{task.buyerName}</td>
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
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

export default ManageTasks;
