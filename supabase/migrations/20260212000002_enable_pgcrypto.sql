-- gen_random_bytes() used in creator_slugs trigger requires pgcrypto
create extension if not exists pgcrypto;
