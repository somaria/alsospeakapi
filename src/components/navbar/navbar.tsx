import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <nav class="bg-gray-800 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Link href="/" class="text-white text-xl font-bold">
                AlsoSpeak
              </Link>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <Link href="/" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Home
                </Link>
                <Link href="/about" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  About
                </Link>
                <Link href="/features" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Features
                </Link>
                <Link href="/contact" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <Link href="/signin" class="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700">
                Sign In
              </Link>
            </div>
          </div>
          <div class="md:hidden flex items-center">
            <button
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-label="Main menu"
              aria-expanded="false"
            >
              <svg
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div class="md:hidden hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
            Home
          </Link>
          <Link href="/about" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
            About
          </Link>
          <Link href="/features" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
            Features
          </Link>
          <Link href="/contact" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
            Contact
          </Link>
          <Link href="/signin" class="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-700">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
});
