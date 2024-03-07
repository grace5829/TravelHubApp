import Link from "next/link";

export default function NavBar() {
  return (
    <div>
      <div>
        <Link href="/">Home</Link>
      </div>
      <div>
        <Link href="/guest">Guest List</Link>
      </div>
    </div>
  );
}
