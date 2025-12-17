import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Users, Crown, Map, MessageCircle, MapPin, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";
import { useLoginRequired } from "@/hooks/useLoginRequired";
import { LoginRequiredDialog } from "@/components/auth/LoginRequiredDialog";

// 需要登录的路径
const requireLoginPaths = ["/dynasties", "/figures", "/events", "/ai-assistant", "/place-names", "/historical-sites"];

const navItems = [
  { path: "/", label: "首页", icon: Home },
  { path: "/dynasties", label: "朝代", icon: Crown },
  { path: "/figures", label: "人物", icon: Users },
  { path: "/events", label: "事件", icon: Map },
  { path: "/place-names", label: "古今地名", icon: MapPin },
  { path: "/historical-sites", label: "历史遗迹", icon: Landmark },
  { path: "/ai-assistant", label: "AI助手", icon: MessageCircle },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { checkLogin, showDialog, setShowDialog } = useLoginRequired();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // 首页不需要登录
    if (!requireLoginPaths.includes(path)) {
      return; // 让 Link 正常跳转
    }
    
    // 需要登录的页面，检查登录状态
    if (!checkLogin()) {
      e.preventDefault(); // 阻止跳转
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="w-full px-4 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">华</span>
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">华夏历史</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 ml-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="ml-2">
                <UserMenu />
              </div>
            </div>

            {/* Mobile Menu Button and User Menu */}
            <div className="flex items-center gap-2 ml-auto md:hidden">
              <UserMenu />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={(e) => {
                        handleNavClick(e, item.path);
                        if (!requireLoginPaths.includes(item.path) || checkLogin()) {
                          setIsOpen(false);
                        }
                      }}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3",
                          isActive && "bg-primary text-primary-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginRequiredDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
};
