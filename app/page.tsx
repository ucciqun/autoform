import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Explore questionnaire.</h1>
      <Link href="/1">go to 1</Link>
    </main>
  );
}
