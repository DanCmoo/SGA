export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gradient-to-r from-beige-200 to-beige-300 rounded-xl w-3/4"></div>
      <div className="space-y-3">
        <div className="h-20 bg-gradient-to-r from-beige-200 to-beige-300 rounded-xl"></div>
        <div className="h-20 bg-gradient-to-r from-beige-200 to-beige-300 rounded-xl"></div>
        <div className="h-20 bg-gradient-to-r from-beige-200 to-beige-300 rounded-xl"></div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-beige-200/50">
      <div className="h-6 bg-gradient-to-r from-beige-200 to-beige-300 rounded-lg w-1/2 mb-4"></div>
      <div className="h-4 bg-gradient-to-r from-beige-200 to-beige-300 rounded-lg w-3/4"></div>
    </div>
  )
}
