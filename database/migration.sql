create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text,
	description text,
	price numeric,
	image text
);

create table if not exists stocks (
	product_id uuid,
	foreign key ("product_id") references "products" ("id"),
	count numeric
);

insert into	products (title, description, price, image) values
('Pikachu', 'Pikachu. Who the h*ll doesnt recognize Pikachu??', '35.9', 'https://img.pokemondb.net/artwork/large/pikachu.jpg'),
('Charizard', 'Charizard is a beastly dragon', '12.4', 'https://img.pokemondb.net/artwork/large/charizard.jpg'),
('Gyarados', 'Gigachad Magikarp', '169.9', 'https://img.pokemondb.net/artwork/large/gyarados.jpg'),
('Eevee', 'Two-faced b*tch... Cute tho. But Cycles is better', '15.0', 'https://img.pokemondb.net/artwork/large/eevee.jpg');

insert into stocks (product_id, count) values
('W-W-W-W', 25),
('X-X-X-X', 60),
('Y-Y-Y-Y', 0);