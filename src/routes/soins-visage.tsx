import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/soins-visage')({
  head: () => pageHead('soins-visage'),
  component: () => <App currentPage="soins-visage" />,
});
