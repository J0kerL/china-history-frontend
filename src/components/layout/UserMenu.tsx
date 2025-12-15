import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    toast({
      title: "已退出登录",
      description: "期待您的再次访问",
    });
    navigate("/");
  };

  if (!user) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => navigate("/login")}
      >
        登录
      </Button>
    );
  }

  return (
    <>
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 gap-1.5 px-3 hover:bg-accent transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:bg-accent"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <User className="h-4 w-4" />
          <span className="font-medium text-foreground">
            {user.username}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 shadow-lg border-border/50" 
        align="end" 
        forceMount
        sideOffset={8}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="font-normal pb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none text-foreground">
              {user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground pt-1">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          onClick={() => navigate("/profile")}
          className="cursor-pointer py-2.5 focus:bg-accent/50 focus:text-accent-foreground"
        >
          <User className="mr-2 h-4 w-4" />
          <span>个人中心</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          onClick={handleLogoutClick}
          className="cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认退出登录</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要退出登录吗？退出后需要重新登录才能访问相关信息。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogoutConfirm}>
            确认退出
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
