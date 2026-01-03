import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { taskAPI } from '@/lib/api';
import { Coins, Calendar, Users, Eye, Search, Loader2, ArrowUpDown } from 'lucide-react';
import { Task } from '@/types';

const TaskList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await taskAPI.getAvailable(
          sortBy === 'default' ? undefined : sortBy,
          searchTerm || undefined
        );
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce for search
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Available Tasks</h1>
          <p className="text-muted-foreground">Browse and complete tasks to earn coins</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-desc">Highest Reward</SelectItem>
                <SelectItem value="price-asc">Lowest Reward</SelectItem>
                <SelectItem value="deadline-asc">Near Deadline First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task, index) => (
              <Card
                key={task._id}
                className={`shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-slide-up stagger-${index + 1}`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={task.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                    alt={task.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 coin-badge">
                    <Coins className="w-3 h-3" />
                    {task.payableAmount}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-lg line-clamp-2">{task.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {task.buyerName}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(task.completionDate)}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {task.requiredWorkers} slots
                    </div>
                  </div>
                  <Button
                    className="w-full gap-2"
                    variant="default"
                    onClick={() => navigate(`/dashboard/task/${task._id}`)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No tasks available at the moment matching your criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
