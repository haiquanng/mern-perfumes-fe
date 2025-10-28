import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/roles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Mail, Calendar, Shield, Edit, Save, X } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');

  const getUserInitials = () => {
    if (!user?.displayName) return 'U';
    return user.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = () => {
    // In real app, this would call the API to update profile
    console.log('Saving profile:', { displayName: editedName });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user?.displayName || '');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Profile Not Available</CardTitle>
            <CardDescription>
              Please sign in to view and manage your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/login')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-white text-purple-600 text-3xl font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {isAdmin(user) && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Shield className="w-5 h-5 text-amber-900" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{user.displayName || 'User'}</h1>
                {isAdmin(user) && (
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                )}
              </div>
              <p className="text-purple-100 text-lg mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">
                    Member since {new Date(user.metadata.creationTime || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-600">Reviews</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-600">Favorites</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-600">Orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs value="info" onValueChange={() => {}}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="info">Personal Information</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Personal Information</CardTitle>
                    <CardDescription>
                      Manage your account details and preferences
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600">
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="gap-2">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="displayName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-purple-600" />
                      Display Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Enter your name"
                        className="h-12 text-base"
                      />
                    ) : (
                      <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 font-medium">{user.displayName || 'Not set'}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Mail className="w-4 h-4 text-purple-600" />
                      Email Address
                    </Label>
                    <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{user.email}</p>
                    </div>
                    <p className="text-xs text-gray-500 pl-6">
                      Your email is linked to your authentication provider and cannot be changed
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Shield className="w-4 h-4 text-purple-600" />
                      Account Type
                    </Label>
                    <div className="h-12 flex items-center px-4 bg-gray-50 rounded-lg">
                      <Badge variant={isAdmin(user) ? 'default' : 'secondary'} className="text-sm">
                        {isAdmin(user) ? 'Administrator' : 'Member'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Your Activity</CardTitle>
                <CardDescription>
                  View your reviews, favorites, and purchase history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activity Yet</h3>
                  <p className="text-gray-600 mb-6">Start exploring our perfume collection and leave your first review!</p>
                  <Button onClick={() => navigate('/')} size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                    Explore Perfumes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


