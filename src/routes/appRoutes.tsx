import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "../components/Layout";

import Home from "../pages/Home";
import UploadPage from "../pages/Upload";
import GalleryPage from "../pages/Gallery";
import CreateEventPage from "../pages/CreateEvent";
import Login from "../pages/Login";
import CreateCompany from "../pages/CreateCompany";
import CreateUserPage from "../pages/CreateUser";
import QRCodePage from "../pages/QRCodePage";
import AdminRoute from "./AdminRoute";
import NotFound from "../pages/NotFound";
import ManageGallery from "../pages/ManageGallery";

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
        cod
        <Route
          path="/gallery/:slug"
          element={
            <PublicRoute>
              <GalleryPage />
            </PublicRoute>
          }
        />
        <Route
          path="/qrcode/:slug"
          element={
            <PublicRoute>
              <QRCodePage />
            </PublicRoute>
          }
        />
        <Route element={<MainLayout />}>
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
              <AdminRoute>
                <CreateUserPage />
              </AdminRoute>
            }
          />
          <Route
            path="/create-company"
            element={
              <AdminRoute>
                <CreateCompany />
              </AdminRoute>
            }
          />
          <Route
            path="/manage-gallery/:eventId"
            element={
              <PrivateRoute>
                <ManageGallery />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
