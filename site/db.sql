CREATE DATABASE dictionary_history;
USE dictionary_history;

CREATE TABLE searches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);