import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/confidentialite')({
  head: () => pageHead('confidentialite'),
  component: () => <App currentPage="confidentialite" />,
});
