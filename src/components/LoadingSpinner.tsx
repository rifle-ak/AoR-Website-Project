export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-surface-border border-t-primary-500 animate-spin"></div>
        <div className="mt-4 text-center">
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    </div>
  )
}
