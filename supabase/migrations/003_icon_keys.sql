-- Replace emoji game icons with stable icon keys for Lucide rendering

UPDATE game_types SET icon = CASE name
  WHEN 'Ping Pong' THEN 'target'
  WHEN 'Basketball' THEN 'dumbbell'
  WHEN 'FIFA' THEN 'target'
  WHEN 'Tennis' THEN 'target'
  WHEN 'Volleyball' THEN 'users'
  WHEN 'Other' THEN 'trophy'
  ELSE 'default'
END
WHERE icon IN ('🏓', '🏀', '⚽', '🎾', '🏐', '🏆', '🎯', '🎮', '🏅');

ALTER TABLE game_types ALTER COLUMN icon SET DEFAULT 'trophy';
