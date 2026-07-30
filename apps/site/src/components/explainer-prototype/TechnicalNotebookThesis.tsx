import VisualEssay from '@components/visual-essay/VisualEssay';
import NotebookNarrativeWorld from './NotebookNarrativeWorld';
import { thesisDocument } from './ThesisPrototype';

interface TechnicalNotebookThesisProps {
  showHeader?: boolean;
}

export default function TechnicalNotebookThesis({
  showHeader = true,
}: TechnicalNotebookThesisProps) {
  return (
    <VisualEssay
      document={thesisDocument}
      Visual={NotebookNarrativeWorld}
      showHeader={showHeader}
    />
  );
}
