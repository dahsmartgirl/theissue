import { GoogleGenAI, Modality } from "@google/genai";
import { Preset } from '../types';

interface GenerateCoverParams {
  preset: Preset;
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


export async function generateCover({ preset, formData, image, stylize }: GenerateCoverParams): Promise<string> {
  const model = 'gemini-2.5-flash-image';

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = date.getFullYear();
  const issueDate = `${month} ${year}`;
  const issueNumber = `ISSUE Nº ${Math.floor(Math.random() * 20) + 1}`;

  const textFields = Object.entries(formData)
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `- ${preset.fields.find(f => f.id === key)?.label || key}: "${value}"`)
    .join('\n');

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
Valid Secondary Lines: "Make it Pop and Sizzle", "The Future of Fashion", "Unshakable, Undeniable", "In An Era of Noise", "The Best of the New Season".
    `;
  }
  
  const backgroundInstruction = stylize 
    ? "Analyze the existing background. If it is busy or distracting, replace it with a clean, minimalist studio background. Valid Backgrounds: A solid color, a subtle gradient, or an abstract, atmospheric, out-of-focus texture. The new background color must be art-directed to complement the subject's outfit and the new color grade."
    : "DO NOT CHANGE BACKGROUND UNLESS AI STYLING IS SELECTED. Since AI Styling is OFF, do NOT change, replace, or significantly alter the original background of the user's photo. Keep it as close to the original as possible while applying lighting and color grade enhancements.";
  
  const prompt = `
CRITICAL MISSION: You are an expert Art Director for a world-class fashion magazine. Your task is to take a user-uploaded image and transform it into a stunning, high-fashion magazine cover, emulating the sophisticated and artistic aesthetic of publications like Vogue.

This is a multi-step process. Follow every step precisely.

STEP 1: ANALYZE & ENHANCE THE UPLOADED IMAGE

You must first elevate the user's base image to a professional editorial standard. Do not change the subject, their pose, or their core outfit. You are enhancing, not replacing.

Subject Enhancement:

Lighting: Re-light the image with dramatic, high-end studio lighting. The lighting must be intentional. Choose one:
- High-Contrast: Create deep, rich shadows and bright, sharp highlights to sculpt the face and body.
- Soft & Luminous: Apply soft, diffused light to create a radiant, ethereal glow on the skin.
- Clean & Graphic: Use bright, even, high-key lighting for a bold, modern, and graphic look.

Skin & Texture: Apply professional-grade retouching. Skin should be smooth and glowing but retain natural texture. Eyes should be sharpened and brightened.

Clothing Texture: Enhance the material qualities of the subject's clothing. Make fabrics look more luxurious: make silk/satin have more sheen, fur/textures look deeper and richer, and pleats/folds more defined.

Color Grading:
Apply a sophisticated, cinematic color grade. Do not leave the colors as-is.
Options: Create a rich monochromatic palette, a vibrant and saturated look, or a high-contrast palette with a single bold accent color. The final color grade must look intentional and expensive.

Background Treatment:
The subject must be the absolute focus.
${backgroundInstruction}

STEP 2: ARTISTIC TYPOGRAPHY & COMPOSITION

This is the most critical step. You will now add the magazine cover typography.

Magazine Title (The Masthead):

Font: Select an iconic font style. Your primary options are:
- Style 1 (Vogue): A bold, high-contrast, elegant serif font (like a Didone or Bodoni typeface).
- Style 2 (AURA!): A clean, bold, modern, and impactful sans-serif font.

Content: Use the title "${formData.masthead || 'VOGUE'}".

Placement: Place the title at the TOP of the image, usually centered.

CRITICAL LAYERING: The title must be intelligently layered for a professional 3D effect. Analyze the subject's silhouette. The title must appear BEHIND the subject's head, hair, or shoulder if they cross the top third of the frame. This is essential.

Cover Lines (The Text):

Intelligent Layout: You must analyze the "negative space" of the enhanced image. Find the open areas where text can be placed without covering the subject's face or key focal points.

Font: Use a clean, modern, and elegant font family (e.g., Helvetica Neue, Montserrat, Futura, or a clean light-weight serif like Garamond). You must use a mix of font weights (e.g., BOLD, REGULAR, LIGHT) and sizes to create a visual hierarchy.

Content Generation:
${contentGenerationInstructions}

Artistic Placement: Arrange the text artistically, not just in a list.
1. Balance the composition.
2. Cluster text in one area sometimes
3. Stack text for a graphic effect.

you can use any of these 3 depending on the vibe of the image.

NEVER LET THE IMAGE FEEL INCOMPLETE. GENERATE TEXTS TO FILL SPACES IN SERIF STYLE

Final Realistic Details:

Barcode: Add a small, subtle, and realistic barcode element in one of the bottom corners (left or right).

Issue Date: Add a very small, light-weight text element (e.g., "${issueDate}" or "${issueNumber}") discreetly at the very top just below the masthead in mono or san-serif style.

FINAL CHECK: The output must be a single, cohesive image. The user's subject must be instantly recognizable but look like they were professionally shot and styled for the cover of Vogue. The typography must be perfectly integrated, balanced, and artistically composed.
`;

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
    throw new Error('The AI model failed to generate an image. This could be due to a policy violation or an internal error.');
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