import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Coins, Calendar, Users, Image, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const { user, updateUserCoins } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    requiredWorkers: '',
    payableAmount: '',
    completionDate: '',
    submissionInfo: '',
    imageUrl: '',
  });

  const totalCost = Number(formData.requiredWorkers || 0) * Number(formData.payableAmount || 0);
  const hasEnoughCoins = (user?.coins || 0) >= totalCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.detail || !formData.requiredWorkers || !formData.payableAmount || !formData.completionDate || !formData.submissionInfo) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!hasEnoughCoins) {
      toast({
        title: 'Insufficient Coins',
        description: 'You don\'t have enough coins. Please purchase more.',
        variant: 'destructive',
      });
      navigate('/dashboard/purchase-coins');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Deduct coins
    updateUserCoins((user?.coins || 0) - totalCost);

    toast({
      title: 'Task Created Successfully',
      description: `Your task has been posted. ${totalCost} coins have been deducted.`,
    });

    setIsLoading(false);
    navigate('/dashboard/my-tasks');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Add New Task</h1>
        <p className="text-muted-foreground">Create a task for workers to complete</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Task Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Watch my YouTube video and comment"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="detail">Task Detail *</Label>
                <Textarea
                  id="detail"
                  name="detail"
                  placeholder="Provide detailed instructions for workers..."
                  value={formData.detail}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredWorkers">Required Workers *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="requiredWorkers"
                    name="requiredWorkers"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.requiredWorkers}
                    onChange={handleChange}
                    className="pl-10"
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payableAmount">Payable Amount (coins per worker) *</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="payableAmount"
                    name="payableAmount"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.payableAmount}
                    onChange={handleChange}
                    className="pl-10"
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionDate">Completion Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="completionDate"
                    name="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Task Image URL</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="submissionInfo">Submission Requirements *</Label>
                <Textarea
                  id="submissionInfo"
                  name="submissionInfo"
                  placeholder="What should workers submit as proof? (e.g., screenshot, username, etc.)"
                  value={formData.submissionInfo}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* Cost Summary */}
            <Card className={`${hasEnoughCoins ? 'border-primary/20 bg-primary/5' : 'border-destructive/20 bg-destructive/5'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {!hasEnoughCoins && <AlertCircle className="w-5 h-5 text-destructive" />}
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <div className="flex items-center gap-1">
                        <Coins className="w-5 h-5 text-accent" />
                        <span className="text-2xl font-bold text-foreground">{totalCost}</span>
                        <span className="text-muted-foreground">coins</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Your Balance</p>
                    <p className={`text-lg font-semibold ${hasEnoughCoins ? 'text-success' : 'text-destructive'}`}>
                      {user?.coins || 0} coins
                    </p>
                  </div>
                </div>
                {!hasEnoughCoins && totalCost > 0 && (
                  <p className="text-sm text-destructive mt-3">
                    You need {totalCost - (user?.coins || 0)} more coins to create this task.
                  </p>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading || (totalCost > 0 && !hasEnoughCoins)}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Task...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTask;
