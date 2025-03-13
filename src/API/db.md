| table_name           | column_name            | data_type                   |
| -------------------- | ---------------------- | --------------------------- |
| applicant_profiles   | user_id                | uuid                        |
| applicant_profiles   | full_name              | character varying           |
| applicant_profiles   | bio                    | text                        |
| applicant_profiles   | resume_url             | text                        |
| applicant_profiles   | contact_number         | character varying           |
| applicant_profiles   | location               | text                        |
| applicant_profiles   | skills                 | ARRAY                       |
| applicant_profiles   | experience             | jsonb                       |
| applicant_profiles   | created_at             | timestamp without time zone |
| applicant_profiles   | updated_at             | timestamp without time zone |
| applicant_ratings    | id                     | integer                     |
| applicant_ratings    | applicant_id           | uuid                        |
| applicant_ratings    | company_id             | uuid                        |
| applicant_ratings    | rating                 | integer                     |
| applicant_ratings    | review                 | text                        |
| applicant_ratings    | created_at             | timestamp without time zone |
| certificates         | id                     | integer                     |
| certificates         | name                   | character varying           |
| certificates         | issued_by              | character varying           |
| certificates         | issue_date             | date                        |
| companies            | id                     | uuid                        |
| companies            | name                   | character varying           |
| companies            | address                | text                        |
| companies            | industry               | character varying           |
| companies            | company_logo_filename  | text                        |
| companies            | company_description    | text                        |
| companies            | registration_no        | character varying           |
| companies            | company_type           | character varying           |
| companies            | company_url            | character varying           |
| companies            | company_email          | character varying           |
| companies            | company_contact_number | character varying           |
| companies            | status                 | boolean                     |
| companies            | created_by             | uuid                        |
| companies            | updated_by             | uuid                        |
| companies            | company_website        | character varying           |
| companies            | company_logo_url       | character varying           |
| companies            | company_culture        | text                        |
| companies            | average_rating         | double precision            |
| company_reviews      | id                     | integer                     |
| company_reviews      | company_id             | uuid                        |
| company_reviews      | applicant_id           | uuid                        |
| company_reviews      | rating                 | integer                     |
| company_reviews      | review                 | text                        |
| company_reviews      | created_at             | timestamp without time zone |
| event_log            | id                     | integer                     |
| event_log            | event_type             | character varying           |
| event_log            | user_id                | uuid                        |
| event_log            | event_details          | jsonb                       |
| event_log            | created_at             | timestamp without time zone |
| interview_schedules  | id                     | integer                     |
| interview_schedules  | vacancy_id             | integer                     |
| interview_schedules  | applicant_id           | uuid                        |
| interview_schedules  | interview_date         | timestamp without time zone |
| interview_schedules  | interview_location     | text                        |
| interview_schedules  | status                 | character varying           |
| job_types            | id                     | integer                     |
| job_types            | name                   | character varying           |
| locations            | id                     | integer                     |
| locations            | name                   | character varying           |
| locations            | address                | text                        |
| locations            | company_id             | uuid                        |
| manager_profiles     | user_id                | uuid                        |
| manager_profiles     | full_name              | character varying           |
| manager_profiles     | company_id             | uuid                        |
| manager_profiles     | job_position           | character varying           |
| manager_profiles     | contact_email          | character varying           |
| manager_profiles     | created_at             | timestamp without time zone |
| manager_profiles     | updated_at             | timestamp without time zone |
| manager_profiles     | location_ids           | ARRAY                       |
| notifications        | id                     | integer                     |
| notifications        | user_id                | uuid                        |
| notifications        | message                | text                        |
| notifications        | notification_type      | character varying           |
| notifications        | is_read                | boolean                     |
| notifications        | created_at             | timestamp without time zone |
| roles                | id                     | integer                     |
| roles                | role_name              | text                        |
| user_roles           | user_id                | uuid                        |
| user_roles           | role_id                | integer                     |
| vacancies            | id                     | integer                     |
| vacancies            | job_title              | character varying           |
| vacancies            | type_id                | integer                     |
| vacancies            | location_id            | integer                     |
| vacancies            | description            | text                        |
| vacancies            | hourly_rate            | double precision            |
| vacancies            | day_salary             | double precision            |
| vacancies            | month_salary           | double precision            |
| vacancies            | yearly_salary          | double precision            |
| vacancies            | special_instructions   | text                        |
| vacancies            | company_id             | uuid                        |
| vacancies            | approved_datetime      | timestamp without time zone |
| vacancies            | approved_by            | uuid                        |
| vacancies            | job_level              | smallint                    |
| vacancies            | created_by             | uuid                        |
| vacancies            | updated_by             | uuid                        |
| vacancies            | status                 | character varying           |
| vacancy_applicants   | vacancy_id             | integer                     |
| vacancy_applicants   | user_id                | uuid                        |
| vacancy_applicants   | application_status     | character varying           |
| vacancy_certificates | vacancy_id             | integer                     |
| vacancy_certificates | certificate_id         | integer                     |
| vacancy_managers     | vacancy_id             | integer                     |
| vacancy_managers     | user_id                | uuid                        |