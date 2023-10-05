import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabaseSchema1696514689071 implements MigrationInterface {
    name = 'CreateDatabaseSchema1696514689071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying NOT NULL, "user_id" uuid NOT NULL, "fingerprint" character varying NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entrances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "number_entrance" integer NOT NULL, "completed" boolean NOT NULL DEFAULT false, "house_id" uuid NOT NULL, CONSTRAINT "PK_42084a4198f5ed4c46257702e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "houses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "house_name" character varying NOT NULL, "street_id" uuid NOT NULL, CONSTRAINT "PK_ee6cacb502a4b8590005eb3dc8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "streets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name_street" character varying NOT NULL, "owner_id" uuid NOT NULL, CONSTRAINT "UQ_3d0ce23304999b9672d24eda171" UNIQUE ("name_street"), CONSTRAINT "PK_e375a3a3ebbc18cf91e72374d94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying, "login" character varying NOT NULL, "password" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "entrances" ADD CONSTRAINT "FK_8364b47d35d7b4646e909b300af" FOREIGN KEY ("house_id") REFERENCES "houses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "houses" ADD CONSTRAINT "FK_61615d64b119e185e76dea91506" FOREIGN KEY ("street_id") REFERENCES "streets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "streets" ADD CONSTRAINT "FK_c5f08bab2cdba93c794c5aec6f0" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "streets" DROP CONSTRAINT "FK_c5f08bab2cdba93c794c5aec6f0"`);
        await queryRunner.query(`ALTER TABLE "houses" DROP CONSTRAINT "FK_61615d64b119e185e76dea91506"`);
        await queryRunner.query(`ALTER TABLE "entrances" DROP CONSTRAINT "FK_8364b47d35d7b4646e909b300af"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "streets"`);
        await queryRunner.query(`DROP TABLE "houses"`);
        await queryRunner.query(`DROP TABLE "entrances"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
