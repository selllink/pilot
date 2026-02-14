# --- Crear un proyecto NUEVO con Terraform (opcional) ---
# Si ya tienes un proyecto (creado a mano en el Dashboard), deja estos en blanco o no los uses.

variable "organization_id" {
  description = "Supabase organization ID. Solo necesario si quieres que Terraform cree un proyecto nuevo (main.tf)."
  type        = string
  default     = ""
}

variable "db_password" {
  description = "Contraseña de la base de datos del proyecto. Solo necesaria si Terraform crea el proyecto (main.tf)."
  type        = string
  default     = ""
  sensitive   = true
}

# Optional: when set, Terraform will create the storage bucket (provider has no bucket resource)
variable "supabase_url" {
  description = "Supabase project URL (to create storage bucket via script)"
  type        = string
  default     = ""
}

variable "supabase_service_role_key" {
  description = "Supabase service role key (to create storage bucket; requires service_role)"
  type        = string
  default     = ""
  sensitive   = true
}
