
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GlassCard from '@/components/ui/GlassCard';
import { InvestmentCircle } from '@/types/community';
import { Plus, DollarSign, Users, Calendar, Heart, ChevronRight, PlusCircle, UserPlus } from 'lucide-react';
import Header from '@/components/layout/Header';

const Community = () => {
  const navigate = useNavigate();
  const [activeCircle, setActiveCircle] = useState<InvestmentCircle | null>(null);
  const [showNewCircleForm, setShowNewCircleForm] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDescription, setNewCircleDescription] = useState('');
  const [newCircleAmount, setNewCircleAmount] = useState('');
  const [newCircleDate, setNewCircleDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for investment circles
  const [circles, setCircles] = useState<InvestmentCircle[]>([
    {
      id: '1',
      name: 'Family Vacation Fund',
      description: 'Saving for our summer trip to Hawaii',
      targetAmount: 20000,
      currentAmount: 6500,
      progress: 65,
      targetDate: new Date(2024, 5, 15),
      createdBy: 'You',
      members: [
        { id: '1', name: 'You', contribution: 4000, joinedAt: new Date(2023, 10, 1) },
        { id: '2', name: 'John Smith', contribution: 2500, joinedAt: new Date(2023, 10, 5) }
      ],
      category: 'Travel'
    },
    {
      id: '2',
      name: 'Home Down Payment',
      description: '$25,000 for our first home together',
      targetAmount: 25000,
      currentAmount: 5000,
      progress: 20,
      targetDate: new Date(2025, 1, 1),
      createdBy: 'You',
      members: [
        { id: '1', name: 'You', contribution: 3000, joinedAt: new Date(2023, 9, 15) },
        { id: '2', name: 'Sarah Johnson', contribution: 2000, joinedAt: new Date(2023, 9, 16) }
      ],
      category: 'Housing'
    },
    {
      id: '3',
      name: 'College Fund',
      description: 'Saving for our children\'s education',
      targetAmount: 50000,
      currentAmount: 10000,
      progress: 20,
      targetDate: new Date(2030, 7, 30),
      createdBy: 'You',
      members: [
        { id: '1', name: 'You', contribution: 5000, joinedAt: new Date(2023, 8, 1) },
        { id: '2', name: 'Michael Brown', contribution: 3000, joinedAt: new Date(2023, 8, 10) },
        { id: '3', name: 'Lisa Green', contribution: 2000, joinedAt: new Date(2023, 8, 15) }
      ],
      category: 'Education'
    }
  ]);

  const handleCircleClick = (circle: InvestmentCircle) => {
    setActiveCircle(circle);
    setActiveTab('overview');
  };

  const handleCreateNewCircle = () => {
    if (newCircleName && newCircleAmount && newCircleDate) {
      const amount = parseFloat(newCircleAmount);
      const newCircle: InvestmentCircle = {
        id: (circles.length + 1).toString(),
        name: newCircleName,
        description: newCircleDescription,
        targetAmount: amount,
        currentAmount: 0,
        progress: 0,
        targetDate: new Date(newCircleDate),
        createdBy: 'You',
        members: [
          { id: '1', name: 'You', contribution: 0, joinedAt: new Date() }
        ],
        category: 'Other'
      };

      setCircles([...circles, newCircle]);
      setShowNewCircleForm(false);
      setNewCircleName('');
      setNewCircleDescription('');
      setNewCircleAmount('');
      setNewCircleDate('');
    }
  };

  const handleAddContribution = () => {
    if (activeCircle) {
      const updatedCircles = circles.map(circle => {
        if (circle.id === activeCircle.id) {
          const newAmount = circle.currentAmount + 500;
          const newProgress = Math.min(Math.round((newAmount / circle.targetAmount) * 100), 100);
          
          return {
            ...circle,
            currentAmount: newAmount,
            progress: newProgress,
            members: circle.members.map(member => {
              if (member.id === '1') {
                return {
                  ...member,
                  contribution: member.contribution + 500
                };
              }
              return member;
            })
          };
        }
        return circle;
      });
      
      setCircles(updatedCircles);
      const updatedActiveCircle = updatedCircles.find(c => c.id === activeCircle.id);
      if (updatedActiveCircle) {
        setActiveCircle(updatedActiveCircle);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar - Circles list */}
          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Investment Circles</h1>
                <Button variant="outline" size="sm" onClick={() => setShowNewCircleForm(!showNewCircleForm)}>
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mb-6">Create and manage investment groups with friends and family</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Your Circles</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Investment groups you've created or joined</p>
                
                {circles.map((circle) => (
                  <Card 
                    key={circle.id} 
                    className={`cursor-pointer transition-all hover:bg-accent/10 ${activeCircle?.id === circle.id ? 'border-primary/50 bg-accent/10' : ''}`}
                    onClick={() => handleCircleClick(circle)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{circle.name}</h3>
                        <Button variant="secondary" size="sm" className="h-7 px-2 py-1 text-xs rounded-full">Active</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{circle.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs">Current</p>
                          <p className="font-medium">{formatCurrency(circle.currentAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground mb-1 text-xs">Target</p>
                          <p className="font-medium">{formatCurrency(circle.targetAmount)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Progress value={circle.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center">
                            <Heart className="w-3 h-3" />
                          </div>
                          <span className="ml-1 text-xs">+2</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Target: {formatDate(circle.targetDate)}</span>
                          <ChevronRight className="ml-1 w-3 h-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {showNewCircleForm ? (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                      Create New Investment Circle
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Start saving based on goals with friends and family</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Circle Name</label>
                        <Input 
                          placeholder="e.g., Family Vacation Fund"
                          value={newCircleName}
                          onChange={(e) => setNewCircleName(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Textarea 
                          placeholder="What are you saving for?"
                          value={newCircleDescription}
                          onChange={(e) => setNewCircleDescription(e.target.value)}
                          className="text-sm h-20"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Savings Goal</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            placeholder="10000"
                            className="pl-9 text-sm"
                            value={newCircleAmount}
                            onChange={(e) => setNewCircleAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Target Date</label>
                        <Input 
                          type="date"
                          className="text-sm"
                          value={newCircleDate}
                          onChange={(e) => setNewCircleDate(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Invite Members</label>
                        <div className="relative">
                          <Input 
                            placeholder="Enter email address"
                            className="pr-9 text-sm"
                          />
                          <Button className="absolute right-0 top-0 h-full px-3" variant="ghost">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">No members added yet</p>
                      </div>
                      
                      <Button 
                        className="w-full mt-4"
                        onClick={handleCreateNewCircle}
                        disabled={!newCircleName || !newCircleAmount || !newCircleDate}
                      >
                        Create Circle
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card 
                    className="border border-dashed border-muted-foreground/30 bg-transparent cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setShowNewCircleForm(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm font-medium">Create New Investment Circle</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </GlassCard>
          </div>
          
          {/* Right content - Circle details */}
          <div className="md:col-span-2">
            {activeCircle ? (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{activeCircle.name}</h2>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                      <Card className="bg-accent/10 border-primary/20">
                        <CardContent className="p-6 flex flex-col items-center justify-center">
                          <DollarSign className="h-10 w-10 text-primary mb-4" />
                          <p className="text-sm text-muted-foreground">Total Saved</p>
                          <h3 className="text-2xl font-bold mt-1">{formatCurrency(activeCircle.currentAmount)}</h3>
                          <p className="text-xs text-muted-foreground mt-1">of {formatCurrency(activeCircle.targetAmount)}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-accent/10 border-primary/20">
                        <CardContent className="p-6 flex flex-col items-center justify-center">
                          <Users className="h-10 w-10 text-primary mb-4" />
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <h3 className="text-2xl font-bold mt-1">{activeCircle.progress}%</h3>
                          <p className="text-xs text-muted-foreground mt-1">to goal</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-accent/10 border-primary/20">
                        <CardContent className="p-6 flex flex-col items-center justify-center">
                          <Calendar className="h-10 w-10 text-primary mb-4" />
                          <p className="text-sm text-muted-foreground">Target Date</p>
                          <h3 className="text-2xl font-bold mt-1">{formatDate(activeCircle.targetDate)}</h3>
                          <p className="text-xs text-muted-foreground mt-1">estimated completion</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>₹0</span>
                        <span>{formatCurrency(activeCircle.targetAmount)}</span>
                      </div>
                      <Progress value={activeCircle.progress} className="h-4 mb-4" />
                      <p className="text-sm text-muted-foreground">{formatCurrency(activeCircle.currentAmount)} saved of {formatCurrency(activeCircle.targetAmount)} goal</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => setActiveCircle(null)}>
                        Edit Circle
                      </Button>
                      <Button onClick={handleAddContribution}>
                        Add Contribution
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="members">
                    <h3 className="text-lg font-semibold mb-4">Circle Members</h3>
                    
                    <div className="space-y-4">
                      {activeCircle.members.map((member) => (
                        <Card key={member.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-medium">{member.name}</h4>
                                  <p className="text-xs text-muted-foreground">Joined {member.joinedAt.toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(member.contribution)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {Math.round((member.contribution / activeCircle.currentAmount) * 100) || 0}% of total
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="outline" className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite New Member
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="chat">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">Circle Chat</h3>
                      <p className="text-muted-foreground">Chat with circle members about your investment plans</p>
                      <Button className="mt-4">Start Conversation</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">Activity Feed</h3>
                      <p className="text-muted-foreground">Track all contributions and updates to your circle</p>
                      <Button className="mt-4">View All Activity</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </GlassCard>
            ) : (
              <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[600px]">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Select a Circle</h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Choose an investment circle from the list or create a new one to start tracking your collective savings goals
                </p>
                <Button onClick={() => setShowNewCircleForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Circle
                </Button>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
