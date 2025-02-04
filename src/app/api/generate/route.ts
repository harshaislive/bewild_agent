import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { SocialMediaPlanInput, PostIdea } from '@/types/posts';
import { format, parse, parseISO, isValid } from 'date-fns';

interface MistralResponse {
  posts: PostIdea[];
}

if (!process.env.MISTRAL_API_KEY) {
  throw new Error('Missing environment variable: MISTRAL_API_KEY');
}

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const systemPrompt = `You are a social media content planner. Your task is to generate creative and engaging social media post ideas based on the provided input. Each post should be unique and align with the brand guidelines and marketing goals.

IMPORTANT: You must ONLY return a valid JSON object in the following format, with NO additional text before or after:
{
  "posts": [
    {
      "post_idea": "Brief description of the post",
      "aims": ["aim1", "aim2"],
      "context": "Additional context or details about the post",
      "reference_materials": ["material1", "material2"],
      "confidence_level": number between 1-10,
      "suggested_type": "reel" | "static_image" | "carousel",
      "best_time": "YYYY-MM-DD"
    }
  ]
}

Guidelines:
1. Return EXACTLY 6 posts
2. Each post should be unique and creative
3. Ensure all dates are in YYYY-MM-DD format
4. Do not add any explanatory text - ONLY return the JSON object
5. Ensure the JSON is valid and properly formatted`;

export async function POST(request: Request) {
  try {
    const input: SocialMediaPlanInput = await request.json();

    // Parse the month year to get the target month for content
    const targetMonth = parse(input.monthYear, 'yyyy-MM', new Date());
    
    const userPrompt = `Generate 6 social media post ideas for ${format(targetMonth, 'MMMM yyyy')} based on the following information:
    
Brand Guidelines: ${input.brandGuidelines}
Target Audience: ${input.targetAudience}
Product Launches: ${input.productLaunches || 'None'}
Marketing Goals: ${input.marketingGoals}
Additional Context: ${input.additionalContext || 'None'}

IMPORTANT: Return ONLY a valid JSON object as specified in the system prompt. Do not include any other text.`;

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-medium",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Mistral API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate ideas. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    try {
      const content = data.choices[0].message.content;
      
      // Try to clean the content if it's not valid JSON
      const cleanedContent = content.trim().replace(/^```json\s*|\s*```$/g, '');
      
      let parsedContent: MistralResponse;
      try {
        parsedContent = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('Failed to parse initial JSON:', parseError);
        console.error('Raw content:', content);
        return NextResponse.json(
          { error: 'Invalid response format from AI service. Please try again.' },
          { status: 500 }
        );
      }
      
      // Validate the response structure
      if (!parsedContent.posts || !Array.isArray(parsedContent.posts)) {
        console.error('Invalid response structure:', parsedContent);
        return NextResponse.json(
          { error: 'Invalid response structure from AI service' },
          { status: 500 }
        );
      }

      // Add unique IDs to each post and validate/format dates
      const postsWithIds = parsedContent.posts.map(post => {
        // Try to parse the date, fallback to current date if invalid
        let formattedDate = new Date().toISOString().split('T')[0]; // Default to YYYY-MM-DD
        
        try {
          // First try parsing as YYYY-MM-DD
          const dateObj = parse(post.best_time, 'yyyy-MM-dd', new Date());
          if (isValid(dateObj)) {
            formattedDate = format(dateObj, 'yyyy-MM-dd');
          }
        } catch (error) {
          console.warn('Invalid date format:', post.best_time);
          // Keep the fallback date
        }

        return {
          ...post,
          id: uuidv4(),
          best_time: formattedDate,
        };
      });

      return NextResponse.json({ posts: postsWithIds });
    } catch (parseError) {
      console.error('Failed to parse Mistral response:', parseError);
      console.error('Raw response:', data);
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Generate route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}