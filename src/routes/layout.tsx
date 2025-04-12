import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import Navbar from "~/components/navbar/navbar";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <main class="flex-grow container mx-auto px-4 py-8">
        <Slot />
      </main>
      <footer class="bg-gray-800 text-white py-6">
        <div class="container mx-auto px-4">
          <p class="text-center"> {new Date().getFullYear()} AlsoSpeak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
});
