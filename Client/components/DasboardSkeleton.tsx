import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <>
            <div className="grid grid-cols-3">
                <Skeleton className="h-screen col-span-1 rounded-lg" />
                <div className="col-span-2">
                    <div className="grid grid-rows-8 h-screen">
                        <Skeleton className="row-span-1 rounded-lg my-1 mx-2" />
                        <Skeleton className="row-span-6 rounded-lg my-1 mx-2" />
                        <Skeleton className="row-span-1 rounded-lg my-1 mx-2" />
                    </div>
                </div>
            </div>
        </>
    )
}