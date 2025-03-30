import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container p-4 md:p-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="space-y-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex">
            <Skeleton className="h-6 w-6 mr-2" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

