// Cloudflare Worker: accepts file uploads and returns a URL
// Uses Cloudinary for file storage (free tier)

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed. Use POST.', { status: 405 });
    }

    try {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: 'Invalid file type. Use JPEG, PNG, or WebP.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check file size (max 2MB for free tier)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        return new Response(
          JSON.stringify({ error: 'File too large. Max 2MB.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${env.API_KEY}:${env.API_SECRET}`).toString('base64')}`
          },
          body: formData,
        }
      );

      const uploadData = await cloudinaryResponse.json();

      if (cloudinaryResponse.ok) {
        return new Response(
          JSON.stringify({
            url: uploadData.secure_url,
            public_id: uploadData.public_id,
            format: uploadData.format || file.name.split('.').pop()
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: uploadData.error?.message || 'Upload failed' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};
