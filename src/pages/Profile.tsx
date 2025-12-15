import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, Calendar, Shield, History, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import * as authService from "@/services/auth";

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || "", email: user.email || "" });
    }
  }, [user]);


  const handleSave = async () => {
    if (!formData.username.trim()) {
      toast({ title: "错误", description: "用户名不能为空", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const response = await authService.updateProfile({
        username: formData.username,
        email: formData.email,
      });
      if (response.code === 0) {
        toast({ title: "保存成功", description: "您的个人信息已更新" });
        setIsEditing(false);
        window.location.reload();
      } else {
        toast({ title: "保存失败", description: response.msg, variant: "destructive" });
      }
    } catch {
      toast({ title: "保存失败", description: "请稍后重试", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({ title: "错误", description: "请填写所有密码字段", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6 || passwordData.newPassword.length > 12) {
      toast({ title: "错误", description: "新密码长度必须在6-12位之间", variant: "destructive" });
      return;
    }
    if (passwordData.confirmPassword.length < 6 || passwordData.confirmPassword.length > 12) {
      toast({ title: "错误", description: "确认密码长度必须在6-12位之间", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "错误", description: "两次输入的新密码不一致", variant: "destructive" });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const response = await authService.updatePassword(passwordData);
      if (response.code === 0) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowSuccessDialog(true);
      } else {
        toast({ title: "更新失败", description: response.msg, variant: "destructive" });
      }
    } catch {
      toast({ title: "更新失败", description: "请稍后重试", variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleGoToLogin = async () => {
    await logout();
    navigate("/login");
  };

  const handleCancelEdit = () => {
    setFormData({ username: user?.username || "", email: user?.email || "" });
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
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
                    <span>注册时间: {user.createdAt ? formatDate(user.createdAt) : "未知"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>账户状态: 正常</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                            <Button onClick={handleSave} disabled={isSaving}>
                              {isSaving ? "保存中..." : "保存"}
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit}>取消</Button>
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
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">新密码 (6-12位)</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="pr-10"
                            minLength={6}
                            maxLength={12}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">确认新密码 (6-12位)</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="pr-10"
                            minLength={6}
                            maxLength={12}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                        {isUpdatingPassword ? "更新中..." : "更新密码"}
                      </Button>
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

      <AlertDialog open={showSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>密码修改成功</AlertDialogTitle>
            <AlertDialogDescription>
              您的密码已成功修改，请使用新密码重新登录。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleGoToLogin}>去登录</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Profile;
