export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Learning App API</h1>
      <p>Next.js + Supabase Backend for Learning Management</p>
      
      <h2>Available API Endpoints:</h2>
      <ul>
        <li><strong>POST /api/prompts</strong> - Log new prompt</li>
        <li><strong>GET /api/prompts</strong> - Get user's prompts</li>
        <li><strong>GET /api/concepts/:user_id</strong> - Fetch user's concepts</li>
        <li><strong>POST /api/concepts</strong> - Add a new concept</li>
        <li><strong>GET /api/exercises/user/:user_id</strong> - Fetch user's exercises</li>
        <li><strong>POST /api/exercises</strong> - Create new exercise</li>
        <li><strong>PATCH /api/exercises/:id</strong> - Mark exercise as completed + store AI feedback</li>
        <li><strong>GET /api/exercises/:id</strong> - Get specific exercise</li>
      </ul>

      <h2>Authentication:</h2>
      <p>All endpoints require a valid JWT token in the Authorization header:</p>
      <code>Authorization: Bearer &lt;your-jwt-token&gt;</code>

      <h2>Database Schema:</h2>
      <ul>
        <li><strong>cursor_prompts:</strong> User prompts with timestamps</li>
        <li><strong>concepts:</strong> Learning concepts linked to prompts</li>
        <li><strong>exercises:</strong> Practice exercises for concepts</li>
      </ul>
    </div>
  );
}
