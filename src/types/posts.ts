export type PostType = 'reel' | 'carousel' | 'static_image';
enum VoiceOverType {
  internal_recording = 'internal_recording',
  ai_generated = 'ai_generated',
  none = 'none'
}
export type AimType = 
  | 'increase_engagement' 
  | 'gain_followers' 
  | 'brand_awareness' 
  | 'drive_sales' 
  | 'community_building'
  | 'product_launch'
  | 'educational_content';

export interface PostIdea {
  id: string;
  post_idea: string;
  aims: AimType[];
  context: string;
  reference_materials: string[];
  confidence_level: number;
  created_at: string;
  suggested_type: PostType;
  best_time?: string;
}

export interface ApprovedPost extends PostIdea {
  post_type: PostType;
  voice_over_required: boolean;
  voice_over_type: VoiceOverType | null;
  publish_date: string;
  due_date: string;
}

export interface SocialMediaPlanInput {
  monthYear: string;
  brandGuidelines: string;
  targetAudience: string;
  productLaunches: string;
  marketingGoals: string;
  additionalContext: string;
}