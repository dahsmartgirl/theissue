
import { DesignTemplate } from './types';

export const TEMPLATES: DesignTemplate[] = [
  // --- MAGAZINES ---
  {
    id: 'vogue',
    category: 'magazine',
    name: 'Vogue',
    description: 'High fashion editorial style',
    previewImage: 'https://picsum.photos/seed/vogue/400/500',
    systemPromptId: 'magazine_vogue',
    aspectRatio: '3/4',
    inputs: [
      { id: 'masthead', label: 'Masthead', type: 'text', placeholder: 'VOGUE', defaultValue: 'VOGUE' },
      { id: 'headline', label: 'Headline', type: 'text', placeholder: 'The Future of Fashion' },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'A New Era of Style' },
    ],
  },
  {
    id: 'forbes',
    category: 'magazine',
    name: 'Forbes',
    description: 'Business & Success',
    previewImage: 'https://picsum.photos/seed/forbes/400/500',
    systemPromptId: 'magazine_forbes',
    aspectRatio: '3/4',
    inputs: [
      { id: 'masthead', label: 'Masthead', type: 'text', placeholder: 'Forbes', defaultValue: 'Forbes' },
      { id: 'headline', label: 'Headline', type: 'text', placeholder: 'The Billionaire Mindset' },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Secrets to Success' },
    ],
  },
  {
    id: 'billboard',
    category: 'magazine',
    name: 'Billboard',
    description: 'Music Industry & Charts',
    previewImage: 'https://picsum.photos/seed/billboard/400/500',
    systemPromptId: 'magazine_billboard',
    aspectRatio: '3/4',
    inputs: [
      { id: 'masthead', label: 'Masthead', type: 'text', placeholder: 'Billboard', defaultValue: 'Billboard' },
      { id: 'headline', label: 'Headline', type: 'text', placeholder: 'Top 100' },
      { id: 'author', label: 'Artist Name', type: 'text', placeholder: 'Artist Name' },
    ],
  },
  {
    id: 'natgeo',
    category: 'magazine',
    name: 'National Geographic',
    description: 'Nature & Science',
    previewImage: 'https://picsum.photos/seed/natgeo/400/500',
    systemPromptId: 'magazine_natgeo',
    aspectRatio: '3/4',
    inputs: [
      { id: 'masthead', label: 'Masthead', type: 'text', placeholder: 'NATIONAL GEOGRAPHIC', defaultValue: 'NATIONAL GEOGRAPHIC' },
      { id: 'headline', label: 'Headline', type: 'text', placeholder: 'The Unseen World' },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Into the Wild' },
    ],
  },
  // --- SOCIAL MEDIA ---
  {
    id: 'linkedin-milestone',
    category: 'social',
    name: 'LinkedIn Milestone',
    description: 'Professional achievement post',
    previewImage: 'https://picsum.photos/seed/linkedin/400/500',
    systemPromptId: 'social_corporate',
    aspectRatio: '4/5',
    inputs: [
      { id: 'milestone_metric', label: 'Metric (e.g. Followers)', type: 'text', placeholder: 'Followers' },
      { id: 'milestone_number', label: 'Number (e.g. 10,000)', type: 'text', placeholder: '10,000' },
      { id: 'highlight_color', label: 'Brand Color', type: 'color', defaultValue: '#0077B5' },
      { 
        id: 'mood', 
        label: 'Vibe', 
        type: 'select', 
        options: ['Professional', 'Excited', 'Minimalist', 'Bold'],
        defaultValue: 'Professional'
      }
    ]
  },
  {
    id: 'youtube-thumbnail',
    category: 'social',
    name: 'YouTube Thumbnail',
    description: 'High CTR video cover',
    previewImage: 'https://picsum.photos/seed/yt/640/360',
    systemPromptId: 'social_youtube',
    aspectRatio: '16/9',
    inputs: [
      { id: 'main_text', label: 'Main Hook', type: 'text', placeholder: 'I BUILT AN AI APP' },
      { id: 'sub_text', label: 'Subtext', type: 'text', placeholder: '(It actually works)' },
      { 
        id: 'expression', 
        label: 'Facial Expression', 
        type: 'select', 
        options: ['Shocked', 'Happy', 'Serious', 'Focused'],
        defaultValue: 'Shocked'
      }
    ]
  }
];
