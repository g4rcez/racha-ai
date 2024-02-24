ALTER TABLE "orderItems" ALTER COLUMN "groupId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "groupId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "groupId" DROP NOT NULL;