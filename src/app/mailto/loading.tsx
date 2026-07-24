export default function Loading() {
  // Define the Loading UI here
  return (
    <div className="container m-auto min-h-screen">
      <div className="flex flex-col gap-6 min-h-screen items-center justify-center">
        <div className="circle-loader"></div>

        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
}
