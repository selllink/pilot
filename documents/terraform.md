# 🚀 Documento Maestro: LinkVenta Express (2026)

Este documento centraliza la arquitectura, infraestructura y diseño de LinkVenta Express: una plataforma minimalista para crear fichas de venta rápidas con expiración automática.

---

## 1. 🎯 Visión del Proyecto
- **Propósito:** Generar links de venta compartibles en segundos sin registro previo.
- **Regla de Negocio:** Links expiran en 30 días (configurable).
- **Fricción Cero:** Creación anónima; edición y gestión mediante SSO (Google/Apple).

---

## 🛠️ 2. Stack Tecnológico & Infraestructura

| Capa | Tecnología | Tipo / Modelo |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | SPA (Single Page Application) |
| **Estilos** | Tailwind CSS | Utility-first Framework |
| **Infraestructura** | Supabase | Backend-as-a-Service (BaaS) |
| **Base de Datos** | PostgreSQL | Relacional con RLS |
| **Auth** | Supabase Auth | SSO (Google/Apple) |
| **Storage** | Supabase Storage | S3-Compatible para fotos |
| **IaC** | Terraform | Gestión de recursos de nube |
| **Hosting** | Vercel | Edge Network Hosting |



---

## 🌍 3. Infraestructura como Código (Terraform)

Configuración para gestionar el proyecto, buckets y autenticación.

```hcl
# providers.tf
terraform {
  required_providers {
    supabase = { source = "supabase/supabase", version = "~> 1.0" }
  }
}

# main.tf
resource "supabase_project" "linkventa_express" {
  organization_id   = var.organization_id
  name              = "LinkVenta Express"
  database_password = var.db_password
  region            = "sa-east-1"
}

# storage.tf
resource "supabase_bucket" "product_images" {
  project_id = supabase_project.linkventa_express.id
  name       = "fotos-productos"
  public     = true
  file_size_limit   = 5242880 # 5MB
  allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]
}

# auth.tf
resource "supabase_auth_config" "auth_settings" {
  project_id = supabase_project.linkventa_express.id
  external_google_enabled = true
  email_confirm_indicator_enabled = false
}