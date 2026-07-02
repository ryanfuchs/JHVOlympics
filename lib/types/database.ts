export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      game_types: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          game_type_id: string;
          team1_score: number;
          team2_score: number;
          played_at: string;
          created_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_type_id: string;
          team1_score: number;
          team2_score: number;
          played_at?: string;
          created_by: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_type_id?: string;
          team1_score?: number;
          team2_score?: number;
          played_at?: string;
          created_by?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      match_players: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          team: number;
          slot: number;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          team: number;
          slot: number;
        };
        Update: {
          id?: string;
          match_id?: string;
          user_id?: string;
          team?: number;
          slot?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      player_stats: {
        Row: {
          user_id: string;
          display_name: string;
          total_matches: number;
          wins: number;
          losses: number;
          ties: number;
          win_rate: number;
        };
        Relationships: [];
      };
      player_stats_by_game: {
        Row: {
          user_id: string;
          display_name: string;
          game_type_id: string;
          game_name: string;
          game_icon: string;
          total_matches: number;
          wins: number;
          losses: number;
          ties: number;
          win_rate: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type GameType = Database["public"]["Tables"]["game_types"]["Row"];
export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type MatchPlayer = Database["public"]["Tables"]["match_players"]["Row"];
export type PlayerStats = Database["public"]["Views"]["player_stats"]["Row"];
export type PlayerStatsByGame =
  Database["public"]["Views"]["player_stats_by_game"]["Row"];

export type MatchWithDetails = Match & {
  game_types: GameType;
  match_players: (MatchPlayer & { profiles: Profile })[];
};
