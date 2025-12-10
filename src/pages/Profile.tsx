import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Shield, History } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "您的个人信息已更新",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">请先登录</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">个人中心</h1>
            <p className="text-muted-foreground">管理您的账户信息和偏好设置</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* 用户信息卡片 */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-center">个人资料</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Separator />
                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>用户ID: {user.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>注册时间: 2024-01-01</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>账户状态: 正常</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 详细信息 */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>账户设置</CardTitle>
                <CardDescription>更新您的个人信息和偏好设置</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">基本信息</TabsTrigger>
                    <TabsTrigger value="security">安全设置</TabsTrigger>
                    <TabsTrigger value="history">浏览历史</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">用户名</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button onClick={handleSave}>保存</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              取消
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => setIsEditing(true)}>编辑资料</Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">当前密码</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">新密码</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">确认新密码</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>更新密码</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <History className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">唐朝历史</p>
                          <p className="text-sm text-muted-foreground">2024-12-10 14:30</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <History className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">李白生平</p>
                          <p className="text-sm text-muted-foreground">2024-12-09 10:15</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <History className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">安史之乱</p>
                          <p className="text-sm text-muted-foreground">2024-12-08 16:45</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
