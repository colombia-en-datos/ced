import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}
