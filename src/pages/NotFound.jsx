import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Return Home</Link>
    </main>
  );
}
