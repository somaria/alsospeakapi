import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  cookie.delete('auth', { path: '/' });
  throw redirect(302, '/');
};
