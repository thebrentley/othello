import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-gray-100 p-4">
      <div className="container mx-auto flex space-x-4">
        <Link href="/">Othello</Link>
      </div>
    </nav>
  );
}
