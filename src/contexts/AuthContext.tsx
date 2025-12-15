import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import * as authService from "@/services/auth";

interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // 清除本地登录状态
  const clearAuth = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // 验证 token 并获取用户信息
  const validateAndFetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // 调用后端接口验证 token 并获取用户信息
      const response = await authService.getCurrentUser();
      if (response.code === 0 && response.data) {
        const userData: User = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          createdAt: response.data.createdAt,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // token 无效，清除登录状态
        clearAuth();
      }
    } catch {
      // 请求失败（如 401），清除登录状态
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    validateAndFetchUser();
  }, [validateAndFetchUser]);

  const login = async (username: string, password: string) => {
    // 调用后端登录接口
    const response = await authService.login({ username, password });

    if (response.code === 0 && response.data) {
      const { token, userId, username: userName } = response.data;

      // 保存 token
      localStorage.setItem("token", token);

      // 获取完整用户信息
      try {
        const userResponse = await authService.getCurrentUser();
        if (userResponse.code === 0 && userResponse.data) {
          const userData: User = {
            id: userResponse.data.id,
            username: userResponse.data.username,
            email: userResponse.data.email,
            createdAt: userResponse.data.createdAt,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch {
        // 如果获取用户信息失败，使用登录返回的基本信息
        const userData: User = {
          id: userId,
          username: userName,
          email: "",
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } else {
      throw new Error(response.msg || "登录失败");
    }
  };

  const logout = async () => {
    try {
      // 调用后端退出登录接口
      await authService.logout();
    } catch (error) {
      console.error("退出登录接口调用失败:", error);
    } finally {
      // 无论接口是否成功，都清除本地状态
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
