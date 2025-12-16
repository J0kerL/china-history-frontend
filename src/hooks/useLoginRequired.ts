import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * 登录检查 Hook
 * 返回检查函数和对话框状态
 */
export const useLoginRequired = () => {
  const { isAuthenticated } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  /**
   * 检查是否需要登录
   * @returns true 表示已登录可以继续，false 表示未登录已弹出提示
   */
  const checkLogin = useCallback(() => {
    if (isAuthenticated) {
      return true;
    }
    setShowDialog(true);
    return false;
  }, [isAuthenticated]);

  return {
    checkLogin,
    showDialog,
    setShowDialog,
    isAuthenticated,
  };
};
