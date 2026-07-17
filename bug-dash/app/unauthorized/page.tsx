export default function Unauthorised(){
  return(
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-4">
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="text-sm text-gray-600">You don&apos;t have permission to view this page.</p>
    </main>
  );
}