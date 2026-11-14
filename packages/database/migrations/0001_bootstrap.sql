CREATE TABLE schema_migrations (
  version text PRIMARY KEY,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE repository_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  owner text NOT NULL,
  repository text NOT NULL,
  provider text NOT NULL DEFAULT 'github' CHECK (provider = 'github'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, owner, repository)
);
CREATE INDEX repository_sources_project_idx ON repository_sources(project_id);
CREATE TABLE environment_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_at timestamptz NOT NULL DEFAULT now(),
  component text NOT NULL CHECK (component IN ('database-smoke'))
);
