import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import IntegrationsPage from "./pages/IntegrationsPage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserDetails } from "./store/slices/userSlice.js";
import ChangePassword from "./pages/ChangePassword.jsx";
import socket from "./lib/socket.js";
import { addOnlineUser, removeOnlineUser, setOnlineUsers } from "./store/slices/appSlice.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const onlineUsers = useSelector(state => state.app.onlineUsers)

  useEffect(() => {
    if (authUser) {
      dispatch(setUserDetails(authUser));

      socket.emit("add-user", authUser._id); //when user logs in, add them to socket to show online status

      socket.emit('show-online-status');

      socket.on('online-users', (users) => {
        dispatch(setOnlineUsers(users));
      });

      socket.on('user-online', (newUserId) => {
        dispatch(addOnlineUser(newUserId));
      });
      socket.on('user-offline', (offlineUserId) => {
        dispatch(removeOnlineUser(offlineUserId));
      });
    }
  }, [authUser, onlineUsers]);

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen relative" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/change-password"
          element={
            <ChangePassword />
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/integrations"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <IntegrationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <ChatPage loggedInUserId={authUser._id} />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
