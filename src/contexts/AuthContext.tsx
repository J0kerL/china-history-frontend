import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as authService from "@/services/auth";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 从 localStorage 恢复用户信息
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // 调用后端登录接口
      const response = await authService.login({ username, password });
      
      if (response.code === 0 && response.data) {
        const { token, userId, username: userName } = response.data;
        
        // 保存token
        localStorage.setItem("token", token);
        
        // 构建用户数据
        const userData: User = {
          id: userId,
          username: userName,
          email: "", // 登录接口不返回email，可以后续通过其他接口获取
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error(response.msg || "登录失败");
      }
    } catch (error) {
      console.error("登录错误:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
