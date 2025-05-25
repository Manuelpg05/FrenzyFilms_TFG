import MovieGrid from "@/components/movie-grid"
import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import ComingSoon from "@/components/coming-soon"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection />
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white text-center">
          <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
            Cartelera Actual
          </span>
        </h2>
        <Suspense fallback={<MovieGridSkeleton />}>
          <MovieGrid />
        </Suspense>
      </div>
      <ComingSoon />
    </main>
  )
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-gray-900 rounded-lg overflow-hidden">
            <Skeleton className="h-[400px] w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
    </div>
  )
}
