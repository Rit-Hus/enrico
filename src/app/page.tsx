export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
      <div className="max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-semibold">BusinessTask AI API</h1>
        <p className="text-sm text-slate-600">
          This service exposes backend endpoints only. Available routes:
        </p>
        <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
          <li><code>/api/ai/onboarding</code></li>
          <li><code>/api/ai/chat</code></li>
          <li><code>/api/ai/extract-profile</code></li>
          <li><code>/api/ai/strategic-analysis</code></li>
          <li><code>/api/ai/tasks</code></li>
        </ul>
        <p className="text-xs text-slate-500">
          UI has been moved to <code>/frontend</code> for optional local testing.
        </p>
      </div>
    </main>
  );
}