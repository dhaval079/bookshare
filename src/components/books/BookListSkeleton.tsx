import { Skeleton } from "@/components/ui/skeleton"
import Card from "../ui/Card"

export default function BookListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card
          key={i}
          className="overflow-hidden border border-gray-100 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="relative aspect-[3/4] w-full bg-gray-100">
            <Skeleton className="h-full w-full" />
          </div>
          <Card className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </Card>
        </Card>
      ))}
    </div>
  )
}
