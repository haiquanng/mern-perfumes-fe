import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { User as UserIcon, Mail, Shield, Edit, Save, X, Key } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { changePasswordService, updateProfileService } from '../services/user';

export default function Profile() {
  const { user, isAuthenticated, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [yob, setYob] = useState<string>('');
  const [gender, setGender] = useState<string>(''); // 'true' | 'false' | ''
  const [tab, setTab] = useState<'info' | 'password'>('info');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user) fetchProfile().catch(() => {});
  }, [user, fetchProfile]);

  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      // if user has gender boolean, map to string
      const g: any = (user as any).gender;
      if (typeof g === 'boolean') setGender(g ? 'true' : 'false');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const body: any = { name: editedName.trim() };
      if (yob) body.yob = Number(yob);
      if (gender !== '') body.gender = gender === 'true';
      await updateProfileService(body);
      await fetchProfile();
      setIsEditing(false);
      toast({ title: 'Profile updated', description: 'Your profile has been saved.' });
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e?.response?.data?.message || 'Please try again.' });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: 'Password too short', description: 'At least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please confirm your new password.' });
      return;
    }
    try {
      await changePasswordService({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: 'Password updated' });
    } catch (e: any) {
      toast({ title: 'Failed to change password', description: e?.response?.data?.message || 'Please try again.' });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full border">
          <CardHeader className="text-center">
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please sign in to manage your profile</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/login')} className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and password</p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                    <CardDescription>Basic details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <Save className="w-4 h-4" /> Save
                      </Button>
                      <Button onClick={() => { setIsEditing(false); setEditedName(user.name || ''); }} variant="outline" className="gap-2">
                        <X className="w-4 h-4" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <UserIcon className="w-4 h-4 text-gray-600" /> Name
                  </Label>
                  {isEditing ? (
                    <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder="Your name" />
                  ) : (
                    <div className="h-11 flex items-center px-3 bg-gray-50 rounded-md text-gray-900">{user.name}</div>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 text-gray-600" /> Email
                  </Label>
                  <div className="h-11 flex items-center px-3 bg-gray-50 rounded-md text-gray-700">{user.email}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Year of Birth</Label>
                    <Input type="number" value={yob} onChange={(e) => setYob(e.target.value)} placeholder="e.g. 1999" disabled={!isEditing} />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Gender</Label>
                    {isEditing ? (
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Male</SelectItem>
                          <SelectItem value="false">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-11 flex items-center px-3 bg-gray-50 rounded-md text-gray-900">
                        {gender === 'true' ? 'Male' : gender === 'false' ? 'Female' : 'Not set'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Role removed by request */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl">Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Key className="w-4 h-4 text-gray-600" /> Current Password
                  </Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleChangePassword}>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


