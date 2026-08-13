export default function Loading() {
  // Define the Loading UI here
  return (
    <div className="container m-auto min-h-screen">
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="circle-loader"></div>

        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
}
