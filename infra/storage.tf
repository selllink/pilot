# The Supabase Terraform provider does NOT support storage buckets (only project, branch, settings).
# We create the bucket via the Storage API using a script, so it remains part of IaC.

resource "null_resource" "create_storage_bucket" {
  count = var.supabase_url != "" && var.supabase_service_role_key != "" ? 1 : 0

  triggers = {
    # Run when URL or key change
    supabase_url = var.supabase_url
  }

  provisioner "local-exec" {
    command     = "node infra/scripts/create-storage-bucket.mjs"
    working_dir = "${path.module}/.."
    environment = {
      SUPABASE_URL              = var.supabase_url
      SUPABASE_SERVICE_ROLE_KEY = var.supabase_service_role_key
    }
  }
}
