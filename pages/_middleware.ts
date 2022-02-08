import { NextRequest, NextResponse } from 'next/server';

const protectedPages = ['/', '/dashboard', '/add-book', '/edit-book'];

export default function middleware(req: NextRequest) {
  if (protectedPages.includes(req.nextUrl.pathname)) {
    const token = req.cookies.ACCESS_TOKEN;

    if (!token) {
      console.log('redirecting');
      return NextResponse.redirect('/login');
    }
  }
}
