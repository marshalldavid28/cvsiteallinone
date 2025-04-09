export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      cv_websites: {
        Row: {
          created_at: string | null
          custom_slug: string | null
          id: string
          original_file_path: string | null
          updated_at: string | null
          user_id: string
          website_data: Json
        }
        Insert: {
          created_at?: string | null
          custom_slug?: string | null
          id?: string
          original_file_path?: string | null
          updated_at?: string | null
          user_id: string
          website_data: Json
        }
        Update: {
          created_at?: string | null
          custom_slug?: string | null
          id?: string
          original_file_path?: string | null
          updated_at?: string | null
          user_id?: string
          website_data?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved: boolean | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean | null
          avatar_url: string | null
          company: string | null
          date: string
          headline: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          rating: number | null
          role: string | null
          source: string | null
          tags: string[] | null
          text: string
          type: string
          verified: boolean
        }
        Insert: {
          approved?: boolean | null
          avatar_url?: string | null
          company?: string | null
          date?: string
          headline?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          rating?: number | null
          role?: string | null
          source?: string | null
          tags?: string[] | null
          text: string
          type: string
          verified?: boolean
        }
        Update: {
          approved?: boolean | null
          avatar_url?: string | null
          company?: string | null
          date?: string
          headline?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          rating?: number | null
          role?: string | null
          source?: string | null
          tags?: string[] | null
          text?: string
          type?: string
          verified?: boolean
        }
        Relationships: []
      }
      typing_results: {
        Row: {
          accuracy: number
          company_id: string
          created_at: string
          duration: number
          id: string
          raw_text: string
          typed_text: string
          user_id: string
          wpm: number
        }
        Insert: {
          accuracy: number
          company_id: string
          created_at?: string
          duration: number
          id?: string
          raw_text: string
          typed_text: string
          user_id: string
          wpm: number
        }
        Update: {
          accuracy?: number
          company_id?: string
          created_at?: string
          duration?: number
          id?: string
          raw_text?: string
          typed_text?: string
          user_id?: string
          wpm?: number
        }
        Relationships: [
          {
            foreignKeyName: "typing_results_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          role?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_all_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          approved: boolean | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      is_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
