import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { taskAPI } from '@/lib/api';
import { PlusCircle, Coins, Calendar, Users, Image, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const { user, refreshUser } = useAuth();
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
    imageUrl: '', // This will still hold URL after upload
  });
  const [taskImageFile, setTaskImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
        title: 'Not available Coin. Purchase Coin',
        description: 'You don\'t have enough coins. Please purchase more.',
        variant: 'destructive',
      });
      navigate('/dashboard/purchase-coins');
      return;
    }

    setIsLoading(true);

    let finalTaskImageUrl = formData.imageUrl;
    if (taskImageFile) {
      setIsUploading(true);
      try {
        const { uploadImage } = await import('@/lib/api');
        finalTaskImageUrl = await uploadImage(taskImageFile);
      } catch (error) {
        toast({
          title: 'Image Upload Warning',
          description: 'Failed to upload task image. Task will be created without it.',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }

    try {
      await taskAPI.create({
        title: formData.title,
        detail: formData.detail,
        requiredWorkers: Number(formData.requiredWorkers),
        payableAmount: Number(formData.payableAmount),
        completionDate: formData.completionDate,
        submissionInfo: formData.submissionInfo,
        imageUrl: finalTaskImageUrl,
      });

      await refreshUser();

      toast({
        title: 'Task Created Successfully',
        description: `Your task has been posted. ${totalCost} coins have been deducted.`,
      });

      navigate('/dashboard/my-tasks');
    } catch (error: any) {
      console.error('Failed to create task:', error);

      if (error.response?.data?.insufficientCoins) {
        toast({
          title: 'Not available Coin. Purchase Coin',
          description: 'Please purchase more coins to create this task.',
          variant: 'destructive',
        });
        navigate('/dashboard/purchase-coins');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to create task',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
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
                <Label htmlFor="taskImage">Task Image (optional)</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="taskImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTaskImageFile(e.target.files?.[0] || null)}
                    className="pl-10 file:text-foreground"
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

            <Button type="submit" className="w-full" disabled={isLoading || isUploading || (totalCost > 0 && !hasEnoughCoins)}>
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isUploading ? 'Uploading Image...' : 'Creating Task...'}
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
