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
          is_guest: boolean;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          created_at?: string;
          is_guest?: boolean;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          is_guest?: boolean;
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
      player_ratings: {
        Row: {
          user_id: string;
          game_type_id: string;
          rating: number;
          games_played: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          game_type_id: string;
          rating?: number;
          games_played?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          game_type_id?: string;
          rating?: number;
          games_played?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      match_elo_changes: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          rating_before: number;
          rating_after: number;
          rating_delta: number;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          rating_before: number;
          rating_after: number;
          rating_delta: number;
        };
        Update: {
          id?: string;
          match_id?: string;
          user_id?: string;
          rating_before?: number;
          rating_after?: number;
          rating_delta?: number;
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
          is_guest: boolean;
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
          is_guest: boolean;
        };
        Relationships: [];
      };
      player_elo_by_game: {
        Row: {
          user_id: string;
          display_name: string;
          game_type_id: string;
          game_name: string;
          game_icon: string;
          rating: number;
          games_played: number;
          is_guest: boolean;
        };
        Relationships: [];
      };
      player_elo_overall: {
        Row: {
          user_id: string;
          display_name: string;
          rating: number;
          games_played: number;
          is_guest: boolean;
        };
        Relationships: [];
      };
      current_season: {
        Row: {
          season_key: string;
        };
        Relationships: [];
      };
      season_standings: {
        Row: {
          season_key: string;
          user_id: string;
          display_name: string;
          is_guest: boolean;
          matches: number;
          wins: number;
          losses: number;
          ties: number;
          elo_delta: number;
          win_rate: number;
          qualified: boolean;
          rank: number;
        };
        Relationships: [];
      };
      season_event_standings: {
        Row: {
          season_key: string;
          game_type_id: string;
          game_name: string;
          game_icon: string;
          user_id: string;
          display_name: string;
          is_guest: boolean;
          matches: number;
          wins: number;
          losses: number;
          ties: number;
          elo_delta: number;
          win_rate: number;
          qualified: boolean;
          rank: number;
        };
        Relationships: [];
      };
      season_champions: {
        Row: {
          season_key: string;
          user_id: string;
          display_name: string;
          matches: number;
          wins: number;
          losses: number;
          ties: number;
          win_rate: number;
          elo_delta: number;
        };
        Relationships: [];
      };
      season_medals: {
        Row: {
          season_key: string;
          game_type_id: string;
          game_name: string;
          game_icon: string;
          user_id: string;
          display_name: string;
          medal: "gold" | "silver" | "bronze";
        };
        Relationships: [];
      };
      season_medal_table: {
        Row: {
          user_id: string;
          display_name: string;
          titles: number;
          gold: number;
          silver: number;
          bronze: number;
          total: number;
        };
        Relationships: [];
      };
      teammate_pairs: {
        Row: {
          player_a_id: string;
          player_a_name: string;
          player_a_is_guest: boolean;
          player_b_id: string;
          player_b_name: string;
          player_b_is_guest: boolean;
          matches_together: number;
          wins: number;
          losses: number;
          ties: number;
          elo_delta: number;
          win_rate: number;
          chemistry: number;
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
export type PlayerEloByGame =
  Database["public"]["Views"]["player_elo_by_game"]["Row"];
export type PlayerEloOverall =
  Database["public"]["Views"]["player_elo_overall"]["Row"];
export type SeasonStanding =
  Database["public"]["Views"]["season_standings"]["Row"];
export type SeasonEventStanding =
  Database["public"]["Views"]["season_event_standings"]["Row"];
export type SeasonChampion =
  Database["public"]["Views"]["season_champions"]["Row"];
export type SeasonMedal = Database["public"]["Views"]["season_medals"]["Row"];
export type SeasonMedalTableRow =
  Database["public"]["Views"]["season_medal_table"]["Row"];
export type TeammatePair =
  Database["public"]["Views"]["teammate_pairs"]["Row"];
export type MatchEloChange =
  Database["public"]["Tables"]["match_elo_changes"]["Row"];

export type MatchWithDetails = Match & {
  game_types: GameType;
  match_players: (MatchPlayer & { profiles: Profile })[];
};
