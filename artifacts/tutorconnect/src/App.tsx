import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";

// Layouts
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import PostList from "@/pages/posts/PostList";
import PostDetail from "@/pages/posts/PostDetail";
import ParentDashboard from "@/pages/parent/Dashboard";
import CreatePost from "@/pages/parent/CreatePost";
import TutorDashboard from "@/pages/tutor/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminPosts from "@/pages/admin/Posts";
import AdminAnalytics from "@/pages/admin/Analytics";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Wrapper for pages with standard Navbar + Footer
function StandardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <StandardLayout><Home /></StandardLayout>
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/posts">
        <StandardLayout><PostList /></StandardLayout>
      </Route>
      <Route path="/posts/:id">
        <StandardLayout><PostDetail /></StandardLayout>
      </Route>

      <Route path="/parent/dashboard">
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/parent/posts/new">
        <ProtectedRoute allowedRoles={["parent"]}>
          <CreatePost />
        </ProtectedRoute>
      </Route>

      <Route path="/tutor/dashboard">
        <ProtectedRoute allowedRoles={["tutor"]}>
          <TutorDashboard />
        </ProtectedRoute>
      </Route>

      {/* Static Pages */}
      <Route path="/about">
        <StandardLayout><About /></StandardLayout>
      </Route>
      <Route path="/contact">
        <StandardLayout><Contact /></StandardLayout>
      </Route>
      <Route path="/privacy">
        <StandardLayout><Privacy /></StandardLayout>
      </Route>
      <Route path="/terms">
        <StandardLayout><Terms /></StandardLayout>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout><AdminUsers /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/posts">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout><AdminPosts /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/analytics">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout><AdminAnalytics /></AdminLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/:rest*">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout>
            <div className="p-8">Feature coming soon.</div>
          </AdminLayout>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
