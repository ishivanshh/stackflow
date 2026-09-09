import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getOrCreateDb from './models/server/dbSetup'
import getOrCreateStorageBucket from './models/server/storage.collection'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    await Promise.all([
        getOrCreateDb(),
        getOrCreateStorageBucket()
    ])
  return NextResponse.next();
}
 
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}