CREATE INDEX IF NOT EXISTS "emailIndex" ON "user" ("email");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");