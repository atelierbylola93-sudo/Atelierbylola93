import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/head-spa')({
  head: () => pageHead('head-spa'),
  component: () => <App currentPage="head-spa" />,
});
