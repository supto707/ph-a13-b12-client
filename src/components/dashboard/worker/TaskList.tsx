import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins, Calendar, Users, Eye, Search } from 'lucide-react';

const mockTasks = [
  {
    id: '1',
    title: 'Watch YouTube Video & Comment',
    buyerName: 'Sarah Buyer',
    completionDate: new Date('2024-02-15'),
    payableAmount: 10,
    requiredWorkers: 50,
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
  },
  {
    id: '2',
    title: 'Complete Online Survey',
    buyerName: 'John Smith',
    completionDate: new Date('2024-02-20'),
    payableAmount: 15,
    requiredWorkers: 100,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
  },
  {
    id: '3',
    title: 'App Download & Review',
    buyerName: 'Mike Johnson',
    completionDate: new Date('2024-02-18'),
    payableAmount: 25,
    requiredWorkers: 30,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
  },
  {
    id: '4',
    title: 'Social Media Follow',
    buyerName: 'Lisa Brown',
    completionDate: new Date('2024-02-25'),
    payableAmount: 5,
    requiredWorkers: 200,
    imageUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400',
  },
  {
    id: '5',
    title: 'Website Testing Feedback',
    buyerName: 'Tom Wilson',
    completionDate: new Date('2024-02-22'),
    payableAmount: 30,
    requiredWorkers: 20,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  },
  {
    id: '6',
    title: 'Data Entry Task',
    buyerName: 'Emily Davis',
    completionDate: new Date('2024-02-28'),
    payableAmount: 20,
    requiredWorkers: 75,
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
  },
];

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = mockTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Available Tasks</h1>
          <p className="text-muted-foreground">Browse and complete tasks to earn coins</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, index) => (
          <Card
            key={task.id}
            className={`shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-slide-up stagger-${index + 1}`}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={task.imageUrl}
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
              <Button className="w-full gap-2" variant="default">
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
