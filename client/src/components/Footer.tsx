export function Footer() {
  return (
    <footer className="mt-auto bg-gray-100 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Farewell Memories App. All rights reserved.</p>
        <p className="mt-2">Created with ❤️ for special goodbyes</p>
      </div>
    </footer>
  );
}
