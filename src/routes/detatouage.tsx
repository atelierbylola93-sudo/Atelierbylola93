import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/detatouage')({
  head: () => pageHead('detatouage'),
  component: () => <App currentPage="detatouage" />,
});
