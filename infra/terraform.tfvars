# Copy to terraform.tfvars and set values. Do not commit terraform.tfvars.
# Provider requires SUPABASE_ACCESS_TOKEN env or access_token in provider block.

# Vacíos = no crear proyecto con Terraform (ya tienes uno en el Dashboard)
organization_id = ""
db_password     = ""

# Optional: create storage bucket via script (provider has no bucket resource)
supabase_url              = "https://wiwmqgcjzbyrlyubhxom.supabase.co"
supabase_service_role_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpd21xZ2NqemJ5cmx5dWJoeG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkyOTI5MSwiZXhwIjoyMDg2NTA1MjkxfQ.9fRKFJYh4vyEklmXO7IQ9iSbm_-9_Ou7_5UNiSo5cmg"

#Supabase terraform token
# sbp_8219b467d53ce9fe017d09c65d178e09e0b99ecd
