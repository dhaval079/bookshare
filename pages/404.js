import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for does not exist.
      </p>
      <div className="mt-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}