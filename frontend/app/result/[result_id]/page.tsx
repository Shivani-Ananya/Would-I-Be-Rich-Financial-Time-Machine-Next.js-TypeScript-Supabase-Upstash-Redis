import { Metadata } from 'next';
import { SimulationService } from '@/lib/api';
import ResultView from '@/components/results/ResultView';

interface Props {
  params: Promise<{ result_id: string }>;
}

/**
 * generateMetadata — calls the service on the server to generate SEO tags.
 * This is crucial for shareable results to look good on social media.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { result_id } = await params;
  
  // Note: On the server, we call the service directly.
  const response = await SimulationService.simulateScenario(result_id);
  const result = response.data;

  if (!result) {
    return {
      title: 'Simulation Not Found | Would I Be Rich If...?',
    };
  }

  const scenarioTitle = result.scenario.title;
  // Clean up title if it already starts with "What if" or "If"
  const cleanTitle = scenarioTitle.replace(/^(What if|If) /i, '');
  const title = `Would I Be Rich If I ${cleanTitle}?`;
  const description = `I could have had ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.alternate_you.value)}! See what your wealth could have been.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      // In a real app, we'd add an image generated via an edge function
      images: [
        {
          url: '/og-image.png', // Placeholder
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { result_id } = await params;
  return <ResultView resultId={result_id} />;
}
