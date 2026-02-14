output "project_id" {
  description = "Supabase project ID (solo si Terraform creó el proyecto)"
  value       = length(supabase_project.linkventa_express) > 0 ? supabase_project.linkventa_express[0].id : null
}

output "project_ref" {
  description = "Supabase project reference (solo si Terraform creó el proyecto)"
  value       = length(supabase_project.linkventa_express) > 0 ? supabase_project.linkventa_express[0].id : null
}
