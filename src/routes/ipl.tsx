import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/ipl')({
  head: () => pageHead('ipl'),
  component: () => <App currentPage="ipl" />,
});
