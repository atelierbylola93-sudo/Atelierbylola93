import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/coiffure')({
  head: () => pageHead('coiffure'),
  component: () => <App currentPage="coiffure" />,
});
