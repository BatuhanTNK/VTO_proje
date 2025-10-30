/*
  # Virtual Try-On Database Schema

  1. New Tables
    - `tryon_history`
      - `id` (uuid, primary key) - Unique identifier for each try-on
      - `user_id` (uuid, nullable) - Reference to auth.users (for future auth)
      - `person_image_url` (text) - URL of the person image
      - `garment_image_url` (text) - URL of the garment image
      - `result_image_url` (text) - URL of the generated result
      - `is_favorite` (boolean) - Whether this is marked as favorite
      - `created_at` (timestamptz) - When the try-on was created
      - `updated_at` (timestamptz) - When the record was last updated
      - `garment_type` (text, nullable) - Type of garment (tops, bottoms, one-pieces)
      - `metadata` (jsonb, nullable) - Additional metadata

  2. Security
    - Enable RLS on `tryon_history` table
    - Add policies for public access (since no auth is implemented yet)
    - Future: restrict to authenticated users only

  3. Indexes
    - Index on created_at for efficient sorting
    - Index on is_favorite for quick favorite queries
*/

CREATE TABLE IF NOT EXISTS tryon_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  person_image_url text NOT NULL,
  garment_image_url text NOT NULL,
  result_image_url text NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  garment_type text,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE tryon_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tryon_history"
  ON tryon_history
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to tryon_history"
  ON tryon_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to tryon_history"
  ON tryon_history
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from tryon_history"
  ON tryon_history
  FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_tryon_history_created_at ON tryon_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tryon_history_is_favorite ON tryon_history(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_tryon_history_user_id ON tryon_history(user_id) WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tryon_history_updated_at
  BEFORE UPDATE ON tryon_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
