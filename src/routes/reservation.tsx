import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/reservation')({
  head: () => pageHead('reservation'),
  component: () => <App currentPage="reservation" />,
});
