import { ValidationOutput } from '@/scripts/signature-validation/eu-dss/output-reader';
import { atom, selector } from 'recoil';

export interface SignedDocumentContext {
  parentFile: string;
  validation: ValidationOutput;
  activeDocument?: number;
}

const documentContextState = atom<SignedDocumentContext | null>({
  key: 'signed-document-context',
  default: null,
});

export const documentFileState = selector({
  key: 'signed-document-context.validation.files',
  get({ get }) {
    const context = get(documentContextState)
    if (context?.validation == null) return []
    return context.validation.files
  },
});

export const activeDocumentIndexState = selector({
  key: 'signed-document-context.activeDocument',
  get: ({ get }) => {
    const context = get(documentContextState)
    const files = get(documentFileState)
    const activeDocument = context?.activeDocument

    if (activeDocument != null && activeDocument >= files.length) {
      return undefined
    }

    return activeDocument
  }
});

export default documentContextState;
