import { createFileRoute } from '@tanstack/react-router';
import App from '../App';
import { pageHead } from '../lib/seo';
export const Route = createFileRoute('/blanchiment-dentaire')({
  head: () => pageHead('blanchiment-dentaire'),
  component: () => <App currentPage="blanchiment-dentaire" />,
});
