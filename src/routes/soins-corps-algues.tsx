import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/soins-corps-algues')({
  head: () => pageHead('soins-corps-algues'),
  component: () => <App currentPage="soins-corps-algues" />,
});
