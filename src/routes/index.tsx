import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/')({
  head: () => pageHead('accueil'),
  component: () => <App currentPage="accueil" />,
});
