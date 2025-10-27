import { Preset } from './types';

export const PRESETS: Preset[] = [
  {
    id: 'vogue',
    name: 'Vogue',
    preview: 'https://picsum.photos/seed/vogue/400/500',
    // The new, detailed prompt is now dynamically generated in the geminiService.
    // This string is kept for context and potential future use.
    prompt: 'A master prompt for generating a Vogue-style cover. The full logic is handled by the geminiService.',
    fields: [
      { id: 'masthead', label: 'Masthead', placeholder: 'VOGUE' },
      { id: 'headline', label: 'Headline', placeholder: 'The Future of Fashion' },
      { id: 'tagline', label: 'Tagline', placeholder: 'A New Era of Style' },
    ],
  },
  {
    id: 'forbes',
    name: 'Forbes',
    preview: 'https://picsum.photos/seed/forbes/400/500',
    prompt: 'Create a business magazine cover in the style of Forbes. The subject should look powerful and successful. Use a strong, bold san-serif font for headlines. The color palette should be professional, often incorporating deep blues, reds, or blacks. The composition must be impactful and convey authority.',
    fields: [
      { id: 'masthead', label: 'Masthead', placeholder: 'Forbes' },
      { id: 'headline', label: 'Headline', placeholder: 'The Billionaire Mindset' },
      { id: 'tagline', label: 'Tagline', placeholder: 'Secrets to Success' },
    ],
  },
  {
    id: 'billboard',
    name: 'Billboard',
    preview: 'https://picsum.photos/seed/billboard/400/500',
    prompt: 'Generate a vibrant music magazine cover similar to Billboard. The mood should be energetic and contemporary. Use dynamic, modern typography. The color scheme should be bright and eye-catching. The photo should capture the artist\'s personality and the essence of their music.',
    fields: [
      { id: 'masthead', label: 'Masthead', placeholder: 'Billboard' },
      { id: 'headline', label: 'Headline', placeholder: 'The Sound of Summer' },
      { id: 'author', label: 'Artist Name', placeholder: 'Artist Name Here' },
    ],
  },
  {
    id: 'natgeo',
    name: 'National Geographic',
    preview: 'https://picsum.photos/seed/natgeo/400/500',
    prompt: 'Produce a magazine cover in the iconic style of National Geographic. The photograph must be breathtaking and tell a story about nature, science, or culture. The iconic yellow border is essential. Typography should be clean and unobtrusive, letting the image speak for itself.',
    fields: [
      { id: 'masthead', label: 'Masthead', placeholder: 'NATIONAL GEOGRAPHIC' },
      { id: 'headline', label: 'Headline', placeholder: 'The Unseen World' },
      { id: 'tagline', label: 'Tagline', placeholder: 'A Journey into the Wild' },
    ],
  },
];
