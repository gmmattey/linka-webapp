export const LOCAL_DIAGNOSIS_FOOTER = 'Motor de análise: Diagnóstico local do Linka';

export function withLocalDiagnosisFooter(text: string): string {
  const base = text.trim();
  if (!base) return LOCAL_DIAGNOSIS_FOOTER;
  if (base.includes(LOCAL_DIAGNOSIS_FOOTER)) return base;
  return `${base}\n\n${LOCAL_DIAGNOSIS_FOOTER}`;
}

