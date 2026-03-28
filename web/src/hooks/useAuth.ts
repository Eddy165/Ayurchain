import { useAppDispatch, useAppSelector } from "../store";
import { selectAuth, loginThunk, registerThunk, getMeThunk, logout, clearError } from "../store/authSlice";
import { LoginPayload, RegisterPayload } from "../types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector(selectAuth);

  const login = async (payload: LoginPayload) => {
    return dispatch(loginThunk(payload));
  };

  const register = async (payload: RegisterPayload) => {
    return dispatch(registerThunk(payload));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const getMe = async () => {
    return dispatch(getMeThunk());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    getMe,
    clearError: clearAuthError,
  };
};
