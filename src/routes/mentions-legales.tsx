import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/mentions-legales')({
  head: () => pageHead('mentions-legales'),
  component: () => <App currentPage="mentions-legales" />,
});
