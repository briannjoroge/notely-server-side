-- CreateTable
CREATE TABLE "user_table" (
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT,
    "date_joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_profile_update" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_table_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "entry_table" (
    "note_id" TEXT NOT NULL,
    "note_title" TEXT NOT NULL,
    "note_synopsis" TEXT NOT NULL,
    "note_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,

    CONSTRAINT "entry_table_pkey" PRIMARY KEY ("note_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_table_user_name_key" ON "user_table"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_table_email_key" ON "user_table"("email");

-- AddForeignKey
ALTER TABLE "entry_table" ADD CONSTRAINT "entry_table_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user_table"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
