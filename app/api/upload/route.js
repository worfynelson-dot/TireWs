import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const contentType = request.headers.get('content-type') || '';
  const contentLength = Number(request.headers.get('content-length'));

  // --- Enforcement of your specific limits ---
  const isVideo = contentType.startsWith('video/');
  const isImage = contentType.startsWith('image/');

  if (isImage && contentLength > 12 * 1024 * 1024) {
    return NextResponse.json({ error: 'Photos must be under 12MB' }, { status: 400 });
  }
  if (isVideo && contentLength > 45 * 1024 * 1024) {
    return NextResponse.json({ error: 'Videos must be under 45MB' }, { status: 400 });
  }
  if (!isImage && !isVideo && contentLength > 20 * 1024 * 1024) {
    return NextResponse.json({ error: 'Files must be under 20MB' }, { status: 400 });
  }

  // Generate a random ID (e.g., 8A2F9B1C) without external libraries
  const randomID = randomBytes(4).toString('hex').toUpperCase();
  const extension = filename.split('.').pop();
  const finalName = `${randomID}.${extension}`;

  try {
    const blob = await put(finalName, request.body, {
      access: 'public',
      addRandomSuffix: false, // Keeps your random ID as the filename
      contentType: contentType,
    });

    return NextResponse.json(blob);
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
