export function BookingPolicy() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <h3 className="font-medium text-amber-800 mb-2">Booking Policy</h3>
      <ul className="text-sm text-amber-700 space-y-1">
        <li>• Please arrive 10 minutes before your appointment</li>
        <li>• Cancellations must be made 24 hours in advance</li>
        <li>• Late arrivals may result in shortened service time</li>
      </ul>
    </div>
  )
}
