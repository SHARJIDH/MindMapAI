"use client"

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const router = useRouter()

  return (
    <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-red-600">Authentication Error</CardTitle>
        <CardDescription className="text-gray-600 text-center">
          {error === 'AccessDenied' 
            ? 'You need to be added as a test user to access this application.' 
            : 'There was an error signing in.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button 
          onClick={() => router.push('/auth/login')}
          className="w-full"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Loading...</CardTitle>
        </CardHeader>
      </Card>
    }>
      <ErrorContent />
    </Suspense>
  )
}
