import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/beaute-regard')({
  head: () => pageHead('beaute-regard'),
  component: () => <App currentPage="beaute-regard" />,
});
