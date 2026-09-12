export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}
