CREATE TABLE IF NOT EXISTS nfc_links (
  color text PRIMARY KEY,
  label text NOT NULL,
  destination text,
  enabled boolean NOT NULL DEFAULT false,
  CONSTRAINT nfc_links_color_check CHECK (color IN ('orange', 'green', 'black', 'burgundy', 'blue'))
);
CREATE TABLE IF NOT EXISTS nfc_opens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  color text NOT NULL REFERENCES nfc_links(color),
  label text NOT NULL,
  destination text NOT NULL,
  opened_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nfc_opens_opened_at ON nfc_opens(opened_at);
INSERT INTO nfc_links (color, label) VALUES
('orange', 'Orange'), ('green', 'Green'), ('black', 'Black'), ('burgundy', 'Burgundy'), ('blue', 'Blue')
ON CONFLICT (color) DO NOTHING;
