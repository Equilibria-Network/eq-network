import type { VisualEssayRendererProps } from '@components/visual-essay/types';
import VisualEssay from '@components/visual-essay/VisualEssay';
import NotebookNarrativeWorld from './NotebookNarrativeWorld';
import { thesisDocument, type ThesisState } from './ThesisPrototype';

function DiagramGrammarWorld(props: VisualEssayRendererProps<ThesisState>) {
  return <NotebookNarrativeWorld {...props} connectorGrammar="notebook-v1" />;
}

export default function DiagramGrammarThesis() {
  return <VisualEssay document={thesisDocument} Visual={DiagramGrammarWorld} showHeader={false} />;
}
