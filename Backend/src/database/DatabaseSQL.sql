CREATE TABLE word
(
    id          SERIAL PRIMARY KEY,
    word        VARCHAR(50) NOT NULL,
    lang        VARCHAR(5) NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  DATE DEFAULT CURRENT_DATE
);
