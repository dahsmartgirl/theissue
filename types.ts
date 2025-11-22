
export type InputType = 'text' | 'textarea' | 'number' | 'color' | 'select' | 'date';

export interface TemplateInput {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  defaultValue?: string;
  options?: string[]; // For select inputs
  helpText?: string;
}

export interface DesignTemplate {
  id: string;
  category: 'magazine' | 'social' | 'print';
  name: string;
  description: string;
  previewImage: string;
  systemPromptId: string;
  aspectRatio: string; // e.g., "3/4", "1/1", "16/9"
  inputs: TemplateInput[];
}
