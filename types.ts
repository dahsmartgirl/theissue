export interface Preset {
  id: string;
  name: string;
  preview: string;
  prompt: string;
  fields: {
    id: 'masthead' | 'headline' | 'tagline' | 'issue' | 'author';
    label: string;
    placeholder: string;
  }[];
}