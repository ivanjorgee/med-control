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
      dispensations: {
        Row: {
          continuous_use: boolean | null
          created_at: string | null
          id: string
          location_id: string | null
          medication_id: string | null
          next_return: string | null
          patient_document: string
          quantity: number
          user_id: string | null
        }
        Insert: {
          continuous_use?: boolean | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          medication_id?: string | null
          next_return?: string | null
          patient_document: string
          quantity: number
          user_id?: string | null
        }
        Update: {
          continuous_use?: boolean | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          medication_id?: string | null
          next_return?: string | null
          patient_document?: string
          quantity?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispensations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispensations_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispensations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dispensings: {
        Row: {
          continuous_use: boolean | null
          created_at: string | null
          dispensed_by: string
          doctor_crm: string
          doctor_name: string
          document_type: string
          id: string
          location_id: string | null
          location_name: string
          measure_unit: string
          medication_id: string | null
          medication_name: string
          next_return_date: string | null
          notes: string | null
          patient_document: string
          patient_name: string
          prescription_date: string
          quantity: number
        }
        Insert: {
          continuous_use?: boolean | null
          created_at?: string | null
          dispensed_by: string
          doctor_crm: string
          doctor_name: string
          document_type: string
          id?: string
          location_id?: string | null
          location_name: string
          measure_unit: string
          medication_id?: string | null
          medication_name: string
          next_return_date?: string | null
          notes?: string | null
          patient_document: string
          patient_name: string
          prescription_date: string
          quantity: number
        }
        Update: {
          continuous_use?: boolean | null
          created_at?: string | null
          dispensed_by?: string
          doctor_crm?: string
          doctor_name?: string
          document_type?: string
          id?: string
          location_id?: string | null
          location_name?: string
          measure_unit?: string
          medication_id?: string | null
          medication_name?: string
          next_return_date?: string | null
          notes?: string | null
          patient_document?: string
          patient_name?: string
          prescription_date?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "dispensings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispensings_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      distributions: {
        Row: {
          approved_by: string | null
          batch_number: string | null
          created_at: string | null
          destination_location: string | null
          id: string
          medication_id: string | null
          medicine_name: string | null
          note: string | null
          quantity: number
          reason: string | null
          requested_by: string | null
          requester_id: string | null
          source_location: string | null
          status: string | null
          target_location: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          approved_by?: string | null
          batch_number?: string | null
          created_at?: string | null
          destination_location?: string | null
          id?: string
          medication_id?: string | null
          medicine_name?: string | null
          note?: string | null
          quantity: number
          reason?: string | null
          requested_by?: string | null
          requester_id?: string | null
          source_location?: string | null
          status?: string | null
          target_location?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          approved_by?: string | null
          batch_number?: string | null
          created_at?: string | null
          destination_location?: string | null
          id?: string
          medication_id?: string | null
          medicine_name?: string | null
          note?: string | null
          quantity?: number
          reason?: string | null
          requested_by?: string | null
          requester_id?: string | null
          source_location?: string | null
          status?: string | null
          target_location?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distributions_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_source_location_fkey"
            columns: ["source_location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_target_location_fkey"
            columns: ["target_location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          city: string | null
          coordinator: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          coordinator?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          coordinator?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medications: {
        Row: {
          created_at: string | null
          expiration: string
          id: string
          location_id: string | null
          lot: string
          name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          expiration: string
          id?: string
          location_id?: string | null
          lot: string
          name: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          expiration?: string
          id?: string
          location_id?: string | null
          lot?: string
          name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "medications_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          batch_number: string
          category: string
          created_at: string | null
          description: string | null
          expiration_date: string
          id: string
          location_id: string | null
          manufacturer: string
          measure_unit: string
          min_quantity: number
          name: string
          quantity: number
          status: string
          updated_at: string | null
        }
        Insert: {
          batch_number: string
          category: string
          created_at?: string | null
          description?: string | null
          expiration_date: string
          id?: string
          location_id?: string | null
          manufacturer: string
          measure_unit: string
          min_quantity?: number
          name: string
          quantity?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          batch_number?: string
          category?: string
          created_at?: string | null
          description?: string | null
          expiration_date?: string
          id?: string
          location_id?: string | null
          manufacturer?: string
          measure_unit?: string
          min_quantity?: number
          name?: string
          quantity?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medicines_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          location_id: string | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          location_id?: string | null
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          location_id?: string | null
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          location_id: string | null
          name: string
          password: string
          role: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          location_id?: string | null
          name: string
          password: string
          role: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          location_id?: string | null
          name?: string
          password?: string
          role?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
