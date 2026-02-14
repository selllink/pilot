# Solo crea un proyecto nuevo si definiste organization_id y db_password.
# Si ya tienes un proyecto (ej. creado en el Dashboard), deja esas variables vacías.
resource "supabase_project" "linkventa_express" {
  count = var.organization_id != "" && var.db_password != "" ? 1 : 0

  organization_id   = var.organization_id
  name              = "LinkVenta Express"
  database_password = var.db_password
  region            = "sa-east-1"
}
