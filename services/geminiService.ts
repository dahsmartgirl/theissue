
import { GoogleGenAI, Modality } from "@google/genai";
import { DesignTemplate } from '../types';

interface GenerateCoverParams {
  template: DesignTemplate;
  formData: Record<string, string>;
  image: string; // base64 string
  stylize: boolean;
}

// Ensure API_KEY is available
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64.split(",")[1],
      mimeType
    },
  };
}

/**
 * MAIN ENTRY POINT
 * Routes the request to the correct prompt generator based on the template category.
 */
export async function generateCover(params: GenerateCoverParams): Promise<string> {
  if (params.template.category === 'social') {
    return generateSocialPost(params);
  }
  return generateMagazineCover(params);
}


/**
 * LOGIC A: MAGAZINE COVERS (Legacy Refactored)
 */
async function generateMagazineCover({ template, formData, image, stylize }: GenerateCoverParams): Promise<string> {
  const model = 'gemini-2.5-flash-image';

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = date.getFullYear();
  const issueDate = `${month} ${year}`;
  const issueNumber = `ISSUE Nº ${Math.floor(Math.random() * 20) + 1}`;

  // Map form data to a string list for the prompt
  const textFields = Object.entries(formData)
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `- ${template.inputs.find(f => f.id === key)?.label || key}: "${value}"`)
    .join('\n');

  const mastheadValue = formData['masthead'] || template.inputs.find(i => i.id === 'masthead')?.defaultValue || 'MAGAZINE';

  let contentGenerationInstructions = '';
  if (textFields) {
    contentGenerationInstructions = `
IF [USER_CUSTOM_TEXT] is provided: This is the main headline. Place it prominently. Use the following text content:
${textFields}
Then, generate 2-3 smaller, secondary placeholder lines to support it based on the masthead/headline/tagline input.
    `;
  } else {
    contentGenerationInstructions = `
IF [USER_CUSTOM_TEXT] is NOT provided: You must generate all cover lines. Create one (1) primary headline and 2-4 secondary lines.
Valid Headlines: "FREE SPIRIT", "POWER IN STILLNESS", "FASHION NOW", "THE NEW ERA", "BOLD & FEARLESS", "CUTTING-EDGE STYLE".
    `;
  }
  
  const backgroundInstruction = stylize 
    ? "Analyze the existing background. If it is busy or distracting, replace it with a clean, minimalist studio background. Valid Backgrounds: A solid color, a subtle gradient, or an abstract, atmospheric, out-of-focus texture."
    : "DO NOT CHANGE BACKGROUND UNLESS AI STYLING IS SELECTED. Keep it as close to the original as possible.";
  
  const prompt = `
CRITICAL MISSION: You are an expert Art Director for a world-class fashion magazine. Your task is to take a user-uploaded image and transform it into a stunning, high-fashion magazine cover.

TEMPLATE STYLE: ${template.name} (${template.description})
ASPECT RATIO: ${template.aspectRatio} (Vertical Editorial)

STEP 1: ANALYZE & ENHANCE THE UPLOADED IMAGE
You must first elevate the user's base image to a professional editorial standard.
- Re-light the image with dramatic, high-end studio lighting.
- Enhance skin texture and clothing details.
- Color Grade: Apply a sophisticated, cinematic color grade appropriate for ${template.name}.
- ${backgroundInstruction}

STEP 2: ARTISTIC TYPOGRAPHY & COMPOSITION
Magazine Title (The Masthead):
- Content: "${mastheadValue}"
- Font: Iconic, bold, high-contrast.
- Placement: TOP of the image, centered.
- CRITICAL LAYERING: The title must appear BEHIND the subject's head if they overlap.

Cover Lines (The Text):
- Intelligent Layout: Analyze negative space.
- Font: Mix of weights (BOLD, REGULAR) and sizes.
- Content Generation:
${contentGenerationInstructions}

Final Realistic Details:
- Add a barcode in the corner.
- Add issue date: "${issueDate}" or "${issueNumber}".

FINAL CHECK: The output must be a single, cohesive image.
`;

  return callGemini(model, prompt, image);
}

/**
 * LOGIC B: SOCIAL MEDIA POSTS (New Architecture)
 */
async function generateSocialPost({ template, formData, image, stylize }: GenerateCoverParams): Promise<string> {
  const model = 'gemini-2.5-flash-image';

  // Generic Field Mapping
  // We iterate over all inputs and create a context string for the AI
  const contextFields = Object.entries(formData)
    .map(([key, value]) => `${template.inputs.find(i => i.id === key)?.label || key}: "${value}"`)
    .join('\n');

  const prompt = `
SYSTEM INSTRUCTION: HIGH-FIDELITY GRAPHIC GENERATOR
CRITICAL MISSION: You are a World-Class Visual Designer and 3D Composition Engine. Your goal is to take user inputs and transform them into a viral, cinematic, high-fidelity social media asset. The output must look like a premium studio render, not a flat template.

TEMPLATE CONTEXT:

Type: ${template.name}

Intent: ${template.description}

Aspect Ratio: ${template.aspectRatio}

USER INPUTS: ${contextFields}

EXECUTION PROTOCOL (STRICT VISUAL RULES)
PHASE 1: CINEMATIC ATMOSPHERE & BACKGROUND

Depth & Lighting: Do not create a flat background. Generate a deep, volumetric environment. Use a rich, dark gradient palette (e.g., deep espresso to burnt orange, or midnight blue to electric cyan) that suggests a physical studio space.

Texture: Apply subtle grain or noise to prevent a "plastic" AI look.

Abstract Elements: In the deep background, render large, out-of-focus 3D typography or abstract geometric shapes (like platform logos) to create a sense of scale. Apply strong Bokeh (Depth of Field) to these elements so they do not compete with the foreground.

PHASE 2: ADVANCED SUBJECT INTEGRATION

Cutout & Placement: Extract the subject from the user's photo with pixel-perfect precision. Center them as the hero of the composition.

Relighting (Crucial): You must artificially "relight" the subject to match the background.

Rim Light: Apply a strong, warm glow (or color-matched light) to the edges of the subject’s hair and shoulders to separate them from the background.

Color Grading: Adjust the subject's skin tones to have a warm, high-contrast, "golden hour" or studio-flash aesthetic.

PHASE 3: 3D TYPOGRAPHY & HIERARCHY

Hero Metric (The Big Number): Treat the main headline (e.g., "67K+") as a 3D Object, not just text. Give it extrusion, a slight bevel, and a metallic or glossy white finish. Add a subtle outer glow to make it pop against the dark shirt/background.

The "Container" Strategy: Do not let secondary text float aimlessly. Place the sub-headline (e.g., "Community") inside a High-Gloss UI Element—specifically a pill-shaped button with a gradient fill and drop shadow.

Body Text: Render long text in a crisp, clean, white Sans-Serif font at the bottom. Use wide kerning (letter spacing) for names to create a cinematic "movie credit" feel.

PHASE 4: THE "PRO" DETAILS (THE SECRET SAUCE)

Glassmorphism: Generate 2-3 "floating" UI cards (like social media notification bubbles or comment sections) behind the subject. Render them with a Frosted Glass effect (blur background, white border, semi-transparent). Tilt them slightly in 3D space to imply motion.

Tech Accents: Overlay thin, white HUD (Heads Up Display) lines, brackets, or small icon lists (Likes, Followers, Comments) in the top corners.

Stamps/Badges: If appropriate, add a metallic "seal of approval" or circular stamp graphic (e.g., "Done & Dusted") with a subtle grunge texture to anchor the composition.

FINAL OUTPUT: A single, hyper-realistic PNG image that balances the user's text hierarchy with a rich, 3D-rendered environment.
`;

  return callGemini(model, prompt, image);
}


/**
 * HELPER: Call Gemini API
 */
async function callGemini(model: string, prompt: string, image: string): Promise<string> {
  const imagePart = fileToGenerativePart(image, image.split(';')[0].split(':')[1]);

  try {
    const result = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                { text: prompt },
                imagePart,
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of result.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error('No image was generated by the API.');

  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error('The AI model failed to generate the design. This could be due to a policy violation or an internal error.');
  }
}

export async function editImage(image: string, prompt: string): Promise<string> {
  const model = 'gemini-2.5-flash-image';
  const imagePart = fileToGenerativePart(image, image.split(';')[0].split(':')[1]);

  try {
    const result = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of result.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error('No image was returned from the edit API.');

  } catch (error) {
    console.error('Gemini API call for editing failed:', error);
    throw new Error('The AI model failed to edit the image. This could be due to a policy violation or an internal error.');
  }
}
