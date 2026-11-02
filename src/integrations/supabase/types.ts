export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          active: boolean
          created_at: string
          featured: boolean
          id: string
          image_url: string
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          featured?: boolean
          id?: string
          image_url: string
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          discount_amount: number
          id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          discount_amount?: number
          id?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          discount_amount?: number
          id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_discount: number | null
          min_order_amount: number
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_discount?: number | null
          min_order_amount?: number
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_discount?: number | null
          min_order_amount?: number
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      deals: {
        Row: {
          active: boolean
          badge: string
          created_at: string
          description: string | null
          discount_text: string
          featured: boolean
          id: string
          image_url: string
          old_price: number | null
          price: number
          title: string
        }
        Insert: {
          active?: boolean
          badge?: string
          created_at?: string
          description?: string | null
          discount_text?: string
          featured?: boolean
          id?: string
          image_url: string
          old_price?: number | null
          price: number
          title: string
        }
        Update: {
          active?: boolean
          badge?: string
          created_at?: string
          description?: string | null
          discount_text?: string
          featured?: boolean
          id?: string
          image_url?: string
          old_price?: number | null
          price?: number
          title?: string
        }
        Relationships: []
      }
      delivery_areas: {
        Row: {
          active: boolean
          created_at: string
          delivery_charges: number
          id: string
          lat: number
          lng: number
          name: string
          radius_km: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          delivery_charges?: number
          id?: string
          lat: number
          lng: number
          name: string
          radius_km?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          delivery_charges?: number
          id?: string
          lat?: number
          lng?: number
          name?: string
          radius_km?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_settings: {
        Row: {
          base_delivery_charges: number
          center_lat: number
          center_lng: number
          center_name: string
          free_radius_km: number
          id: string
          updated_at: string
        }
        Insert: {
          base_delivery_charges?: number
          center_lat?: number
          center_lng?: number
          center_name?: string
          free_radius_km?: number
          id?: string
          updated_at?: string
        }
        Update: {
          base_delivery_charges?: number
          center_lat?: number
          center_lng?: number
          center_name?: string
          free_radius_km?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      foods: {
        Row: {
          active: boolean
          badge: string | null
          category_id: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string
          price: number
          rating: number | null
          sku: string | null
          stock: number | null
          title: string
        }
        Insert: {
          active?: boolean
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url: string
          price: number
          rating?: number | null
          sku?: string | null
          stock?: number | null
          title: string
        }
        Update: {
          active?: boolean
          badge?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string
          price?: number
          rating?: number | null
          sku?: string | null
          stock?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "foods_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          points: number
          reason?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          food_id: string | null
          id: string
          order_id: string
          price: number
          quantity: number
          title: string
        }
        Insert: {
          created_at?: string
          food_id?: string | null
          id?: string
          order_id: string
          price: number
          quantity?: number
          title: string
        }
        Update: {
          created_at?: string
          food_id?: string | null
          id?: string
          order_id?: string
          price?: number
          quantity?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_paid: number
          assigned_at: string | null
          coupon_code: string | null
          created_at: string
          customer_address: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivered_at: string | null
          delivery_charges: number
          delivery_lat: number | null
          delivery_lng: number | null
          discount_amount: number
          distance_km: number | null
          id: string
          notes: string | null
          order_type: string
          payment_method: string
          points_earned: number
          points_redeemed: number
          rider_id: string | null
          source: string
          status: string
          subtotal: number
          table_no: string | null
          total: number
          user_id: string
        }
        Insert: {
          amount_paid?: number
          assigned_at?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivered_at?: string | null
          delivery_charges?: number
          delivery_lat?: number | null
          delivery_lng?: number | null
          discount_amount?: number
          distance_km?: number | null
          id?: string
          notes?: string | null
          order_type?: string
          payment_method?: string
          points_earned?: number
          points_redeemed?: number
          rider_id?: string | null
          source?: string
          status?: string
          subtotal?: number
          table_no?: string | null
          total?: number
          user_id: string
        }
        Update: {
          amount_paid?: number
          assigned_at?: string | null
          coupon_code?: string | null
          created_at?: string
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivered_at?: string | null
          delivery_charges?: number
          delivery_lat?: number | null
          delivery_lng?: number | null
          discount_amount?: number
          distance_km?: number | null
          id?: string
          notes?: string | null
          order_type?: string
          payment_method?: string
          points_earned?: number
          points_redeemed?: number
          rider_id?: string | null
          source?: string
          status?: string
          subtotal?: number
          table_no?: string | null
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      pos_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pos_shifts: {
        Row: {
          cashier_id: string
          cashier_name: string | null
          closed_at: string | null
          closing_cash: number | null
          created_at: string
          expected_cash: number | null
          id: string
          notes: string | null
          opened_at: string
          opening_cash: number
          updated_at: string
        }
        Insert: {
          cashier_id: string
          cashier_name?: string | null
          closed_at?: string | null
          closing_cash?: number | null
          created_at?: string
          expected_cash?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opening_cash?: number
          updated_at?: string
        }
        Update: {
          cashier_id?: string
          cashier_name?: string | null
          closed_at?: string | null
          closing_cash?: number | null
          created_at?: string
          expected_cash?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opening_cash?: number
          updated_at?: string
        }
        Relationships: []
      }
      pos_tables: {
        Row: {
          active: boolean
          area: string
          created_at: string
          id: string
          name: string
          reserved: boolean
          seats: number
          table_no: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          area?: string
          created_at?: string
          id?: string
          name: string
          reserved?: boolean
          seats?: number
          table_no: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          area?: string
          created_at?: string
          id?: string
          name?: string
          reserved?: boolean
          seats?: number
          table_no?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          loyalty_points: number
          notification_prefs: Json
          phone: string | null
          referral_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          loyalty_points?: number
          notification_prefs?: Json
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          loyalty_points?: number
          notification_prefs?: Json
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          scope: string
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform?: string
          scope?: string
          token: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          scope?: string
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          reward_granted: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          reward_granted?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_id?: string
          reward_granted?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          comment: string
          created_at: string
          food_id: string | null
          id: string
          rating: number
          user_id: string
          user_name: string
        }
        Insert: {
          approved?: boolean
          comment?: string
          created_at?: string
          food_id?: string | null
          id?: string
          rating?: number
          user_id: string
          user_name?: string
        }
        Update: {
          approved?: boolean
          comment?: string
          created_at?: string
          food_id?: string | null
          id?: string
          rating?: number
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_documents: {
        Row: {
          created_at: string
          doc_type: string
          expiry_date: string | null
          file_url: string
          id: string
          rider_id: string
          status: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          expiry_date?: string | null
          file_url?: string
          id?: string
          rider_id: string
          status?: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          expiry_date?: string | null
          file_url?: string
          id?: string
          rider_id?: string
          status?: string
        }
        Relationships: []
      }
      rider_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          rider_id: string
          sender: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean
          rider_id: string
          sender: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          rider_id?: string
          sender?: string
        }
        Relationships: []
      }
      rider_notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          rider_id: string
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          rider_id: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          rider_id?: string
          title?: string
        }
        Relationships: []
      }
      rider_payouts: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          rider_id: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          rider_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          rider_id?: string
          status?: string
        }
        Relationships: []
      }
      rider_schedule: {
        Row: {
          available: boolean
          day_of_week: number
          end_time: string
          id: string
          rider_id: string
          start_time: string
        }
        Insert: {
          available?: boolean
          day_of_week: number
          end_time?: string
          id?: string
          rider_id: string
          start_time?: string
        }
        Update: {
          available?: boolean
          day_of_week?: number
          end_time?: string
          id?: string
          rider_id?: string
          start_time?: string
        }
        Relationships: []
      }
      rider_settings: {
        Row: {
          commission_percent: number
          id: string
          min_payout: number
          payout_schedule: string
          per_km_rate: number
          points_per_order: number
          support_phone: string
          support_whatsapp: string
          updated_at: string
        }
        Insert: {
          commission_percent?: number
          id?: string
          min_payout?: number
          payout_schedule?: string
          per_km_rate?: number
          points_per_order?: number
          support_phone?: string
          support_whatsapp?: string
          updated_at?: string
        }
        Update: {
          commission_percent?: number
          id?: string
          min_payout?: number
          payout_schedule?: string
          per_km_rate?: number
          points_per_order?: number
          support_phone?: string
          support_whatsapp?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          name: string
          rating: number | null
          role: string | null
          text: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          name: string
          rating?: number | null
          role?: string | null
          text: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          name?: string
          rating?: number | null
          role?: string | null
          text?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address: string
          created_at: string
          id: string
          is_default: boolean
          label: string
          lat: number | null
          lng: number | null
          phone: string | null
          recipient_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          recipient_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          recipient_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          address: string
          contact_email: string
          contact_phone: string
          delivery_charges: number
          facebook_url: string | null
          free_delivery_above: number
          id: string
          instagram_url: string | null
          logo_url: string | null
          maintenance_message: string
          maintenance_mode: boolean
          opening_hours_weekday: string
          opening_hours_weekend: string
          restaurant_name: string
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string
          contact_email?: string
          contact_phone?: string
          delivery_charges?: number
          facebook_url?: string | null
          free_delivery_above?: number
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          maintenance_message?: string
          maintenance_mode?: boolean
          opening_hours_weekday?: string
          opening_hours_weekend?: string
          restaurant_name?: string
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          contact_email?: string
          contact_phone?: string
          delivery_charges?: number
          facebook_url?: string | null
          free_delivery_above?: number
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          maintenance_message?: string
          maintenance_mode?: boolean
          opening_hours_weekday?: string
          opening_hours_weekend?: string
          restaurant_name?: string
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "rider"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "rider"],
    },
  },
} as const
