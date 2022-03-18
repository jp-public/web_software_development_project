PostgreSQL database tables used by application: note: You need to change config @database.js to match your own database.

CREATE TABLE users ( id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, password CHAR(60) );

CREATE TABLE questions ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), title VARCHAR(256) NOT NULL, question_text TEXT NOT NULL );

CREATE TABLE question_answer_options ( id SERIAL PRIMARY KEY, question_id INTEGER REFERENCES questions(id), option_text TEXT NOT NULL, is_correct BOOLEAN DEFAULT false );

CREATE TABLE question_answers ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), question_id INTEGER REFERENCES questions(id), question_answer_option_id INTEGER REFERENCES question_answer_options(id), correct BOOLEAN DEFAULT false );

CREATE UNIQUE INDEX ON users((lower(email)));

insert into users (email, password) values ('tester1@mail.com', 'test-password'); insert into users (email, password) values ('tester2@mail.com', 'test-password'); insert into questions (user_id, title, question_text) values ('1', 'q1', 'test q1'); insert into questions (user_id, title, question_text) values ('2', 'q2', 'test q4'); insert into question_answer_options (question_id, option_text, is_correct) values ('1', 'a', 'true'); insert into question_answer_options (question_id, option_text, is_correct) values ('1', 'b', 'false'); insert into question_answer_options (question_id, option_text, is_correct) values ('2', 'a', 'false'); insert into question_answer_options (question_id, option_text, is_correct) values ('2', 'b', 'true'); insert into question_answers (user_id, question_id, question_answer_option_id, correct) values ('1', '1', '1', 'true'); insert into question_answers (user_id, question_id, question_answer_option_id, correct) values ('1', '1', '1', 'true'); insert into question_answers (user_id, question_id, question_answer_option_id, correct) values ('1', '2', '3', 'false'); insert into question_answers (user_id, question_id, question_answer_option_id, correct) values ('1', '1', '2', 'false');