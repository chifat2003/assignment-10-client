export async function GET() {
  try {
    // Use server-side env var (BACKEND_URL) or fall back to NEXT_PUBLIC_BACKEND_URL
    const backendUrl = process.env.BACKEND_URL
      || process.env.NEXT_PUBLIC_BACKEND_URL
      || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error(`Backend API error: ${response.status}`);
      return Response.json([], { status: 200 });
    }

    const data = await response.json();

    // Filter to show only lawyers
    const lawyersOnly = data.filter(user => user.role === 'lawyer' && !user.isBlocked);

    // Map to component structure
    const mappedLawyers = lawyersOnly.map((user, index) => {
      // Parse languages if it's a string, otherwise use as array
      let languages = [];
      if (user.languages) {
        if (typeof user.languages === 'string') {
          try {
            languages = JSON.parse(user.languages);
          } catch {
            languages = [user.languages];
          }
        } else if (Array.isArray(user.languages)) {
          languages = user.languages;
        }
      }

      return {
        id: user._id || String(index),
        name: user.name,
        title: `${user.experience || 0} years experience`,
        avatar: user.image || 'https://i.ibb.co/default-avatar.jpg',
        rating: user.rating || 0,
        reviewCount: user.reviewCount || 0,
        experience: user.experience || 0,
        casesWon: user.caseWon || 0,
        successRate: user.rating ? Math.round(user.rating * 20) : 0,
        bio: user.bio || 'Professional lawyer',
        specialization: user.specialization || 'General Practice',
        location: user.location || 'Not specified',
        languages: Array.isArray(languages) ? languages : [],
        fee: 150,
        availability: user.availability || 'Available',
        badge: user.rating >= 4.5 ? 'Top Rated' : user.rating >= 4 ? 'Verified' : null,
        tags: ['Licensed', 'Verified'],
      };
    });

    return Response.json(mappedLawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    return Response.json([], { status: 200 });
  }
}
