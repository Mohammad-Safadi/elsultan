export default function ProtectedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <h1 className="text-3xl font-bold text-primary">This is a protected page.</h1>
      <p className="mt-4 text-gray-600">You should see a Basic Auth prompt before accessing this page in production.</p>
    </div>
  );
} 