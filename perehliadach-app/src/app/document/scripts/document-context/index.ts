import { useRecoilState, useRecoilValue } from 'recoil';
import state, { SignedDocumentContext, activeDocumentIndexState, documentFileState } from '../../../../scripts/global-state/signed-document-context';
import { getRecoil, setRecoil } from 'recoil-nexus';

export const useDocumentContext = () => useRecoilState(state);

export const useFileListValue = () => useRecoilValue(documentFileState);

export const useActiveDocumentIndexValue = () => useRecoilValue(activeDocumentIndexState);

export const useActiveDocumentValue = () => {
  const activeDocumentIndex = useActiveDocumentIndexValue();
  const files = useFileListValue();

  if (activeDocumentIndex == null) {
    return null;
  }

  return files[activeDocumentIndex];
};

export const setDocumentContext = 
  (valOrUpdater: (SignedDocumentContext | null) | ((currVal: SignedDocumentContext | null) => (SignedDocumentContext | null))) =>
    setRecoil(state, valOrUpdater);

export const getDocumentContext = () => getRecoil(state);

export const setActiveDocument = (index: number) => 
  setDocumentContext(v => v == null ? null : ({ ...v, activeDocument: index }));