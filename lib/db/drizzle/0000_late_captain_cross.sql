CREATE TYPE "public"."role" AS ENUM('admin', 'tutor', 'parent');--> statement-breakpoint
CREATE TYPE "public"."gender_preference" AS ENUM('male', 'female', 'any');--> statement-breakpoint
CREATE TYPE "public"."medium" AS ENUM('english', 'hindi');--> statement-breakpoint
CREATE TYPE "public"."mode" AS ENUM('home', 'online');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('post', 'user');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"phone" text,
	"role" "role" DEFAULT 'parent' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tuition_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"class" text NOT NULL,
	"subjects" text NOT NULL,
	"gender_preference" "gender_preference" DEFAULT 'any',
	"medium" "medium" NOT NULL,
	"mode" "mode" NOT NULL,
	"address" text NOT NULL,
	"duration" numeric(4, 1) NOT NULL,
	"days_per_week" integer NOT NULL,
	"monthly_fee" integer NOT NULL,
	"description" text,
	"contact_phone" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_by_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"tutor_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"tutor_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"amount" integer DEFAULT 4900 NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporter_id" integer NOT NULL,
	"type" "report_type" NOT NULL,
	"target_id" integer NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tuition_posts" ADD CONSTRAINT "tuition_posts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_post_id_tuition_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."tuition_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_post_id_tuition_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."tuition_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;