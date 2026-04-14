export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">Tasks</p>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="text-3xl font-bold">3</p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">AI Insights</p>
          <p className="text-3xl font-bold">4</p>
        </div>
      </div>
    </div>
  );
}
