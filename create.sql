CREATE TABLE users
(
	ID SERIAL PRIMARY KEY, 
	username TEXT UNIQUE, 
	salt TEXT, 
	hash TEXT
);

CREATE TABLE posts
(
	ID SERIAL, 
	title TEXT, 
	content TEXT, 
	author TEXT REFERENCES users(username), 
	date TIMESTAMP WITH TIME ZONE
);