export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      approvedposts: {
        Row: {
          id: string
          post_idea: string
          aims: string[]
          context: string
          reference_materials: string[]
          confidence_level: number
          post_type: 'static_image' | 'carousel' | 'reel'
          voice_over_required: boolean
          voice_over_type: 'internal_recording' | 'ai_generated' | null
          publish_date: string
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          post_idea: string
          aims: string[]
          context: string
          reference_materials: string[]
          confidence_level: number
          post_type: 'static_image' | 'carousel' | 'reel'
          voice_over_required?: boolean
          voice_over_type?: 'internal_recording' | 'ai_generated' | null
          publish_date: string
          due_date: string
          created_at?: string
        }
        Update: {
          id?: string
          post_idea?: string
          aims?: string[]
          context?: string
          reference_materials?: string[]
          confidence_level?: number
          post_type?: 'static_image' | 'carousel' | 'reel'
          voice_over_required?: boolean
          voice_over_type?: 'internal_recording' | 'ai_generated' | null
          publish_date?: string
          due_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      post_type: 'static_image' | 'carousel' | 'reel'
      voice_over_type: 'internal_recording' | 'ai_generated'
    }
  }
} 