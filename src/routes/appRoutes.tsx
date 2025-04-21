import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import Home from "../pages/Home";
import UploadPage from "../pages/Upload";
import GalleryPage from "../pages/Gallery";
import CreateEventPage from "../pages/CreateEvent";
import Login from "../pages/Login";
import CreateCompany from "../pages/CreateCompany";
import CreateUserPage from "../pages/CreateUser";
import MainLayout from "../components/Layout";
import PrivateRoute from "./PrivateRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/upload/:slug"
          element={
            <PublicRoute>
              <UploadPage />
            </PublicRoute>
          }
        />
        <Route
          path="/gallery/:slug"
          element={
            <PublicRoute>
              <GalleryPage />
            </PublicRoute>
          }
        />

        <Route element={<MainLayout />}>
          <Route
            path="/create-company"
            element={
              <PrivateRoute>
                <CreateCompany />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <PrivateRoute>
                <CreateEventPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <PrivateRoute>
                <CreateUserPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
