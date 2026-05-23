import {
  WifiOff,
} from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020817] px-4 text-center text-white">
      <WifiOff className="h-20 w-20 text-blue-400" />

      <h1 className="mt-6 text-5xl font-black">
        You Are Offline
      </h1>

      <p className="mt-4 max-w-md text-gray-400">
        Please check your internet
        connection. Cached bookings
        and data may still be
        available.
      </p>
    </div>
  );
}