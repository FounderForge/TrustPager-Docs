import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Lazy-loaded pages
const Landing = lazy(() => import('@/pages/Landing'));
const QuickStart = lazy(() => import('@/pages/QuickStart'));
const Authentication = lazy(() => import('@/pages/Authentication'));
const ApiHub = lazy(() => import('@/pages/api/ApiHub'));
const ResourcePage = lazy(() => import('@/pages/api/ResourcePage'));
const McpSetup = lazy(() => import('@/pages/McpSetup'));
const McpTools = lazy(() => import('@/pages/McpTools'));
const McpExamples = lazy(() => import('@/pages/McpExamples'));
const Errors = lazy(() => import('@/pages/Errors'));
const Changelog = lazy(() => import('@/pages/Changelog'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/quickstart" element={<QuickStart />} />
            <Route path="/authentication" element={<Authentication />} />
            <Route path="/api" element={<ApiHub />} />
            <Route path="/api/:resource" element={<ResourcePage />} />
            <Route path="/mcp" element={<Navigate to="/mcp/setup" replace />} />
            <Route path="/mcp/setup" element={<McpSetup />} />
            <Route path="/mcp/tools" element={<McpTools />} />
            <Route path="/mcp/examples" element={<McpExamples />} />
            <Route path="/errors" element={<Errors />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
