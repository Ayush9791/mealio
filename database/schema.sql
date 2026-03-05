--
-- PostgreSQL database dump
--

\restrict QywvX3V3w5XAlycUCjWmSQf8p72EndJ5NsZrBPzv5jSDLju63gPXgwXzSY0fYvp

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

-- Started on 2026-03-05 19:21:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16411)
-- Name: food_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_listings (
    id uuid NOT NULL,
    restaurant_id uuid,
    accepted_by uuid,
    title text NOT NULL,
    description text,
    quantity_portions integer,
    expiry_time timestamp without time zone,
    latitude double precision,
    longitude double precision,
    status text DEFAULT 'available'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT food_listings_status_check CHECK ((status = ANY (ARRAY['available'::text, 'accepted'::text, 'completed'::text, 'expired'::text, 'cancelled'::text])))
);


ALTER TABLE public.food_listings OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16454)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid,
    listing_id uuid,
    message text,
    type text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16432)
-- Name: pickups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pickups (
    id uuid NOT NULL,
    listing_id uuid,
    ngo_id uuid,
    pickup_time timestamp without time zone,
    status text DEFAULT 'scheduled'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pickups_status_check CHECK ((status = ANY (ARRAY['scheduled'::text, 'completed'::text, 'cancelled'::text])))
);


ALTER TABLE public.pickups OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL,
    phone text,
    address text,
    latitude double precision,
    longitude double precision,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['restaurant'::text, 'ngo'::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4916 (class 0 OID 16411)
-- Dependencies: 216
-- Data for Name: food_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.food_listings (id, restaurant_id, accepted_by, title, description, quantity_portions, expiry_time, latitude, longitude, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4918 (class 0 OID 16454)
-- Dependencies: 218
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, listing_id, message, type, is_read, created_at) FROM stdin;
\.


--
-- TOC entry 4917 (class 0 OID 16432)
-- Dependencies: 217
-- Data for Name: pickups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pickups (id, listing_id, ngo_id, pickup_time, status, created_at) FROM stdin;
\.


--
-- TOC entry 4915 (class 0 OID 16399)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, phone, address, latitude, longitude, created_at, updated_at) FROM stdin;
fdd5036f-28d1-4d52-827c-4eab6e4bd2cb	Test Restaurant	restaurant@test.com	hashed_password	restaurant	\N	\N	\N	\N	2026-03-05 14:12:47.686615	2026-03-05 14:12:47.686615
\.


--
-- TOC entry 4759 (class 2606 OID 16421)
-- Name: food_listings food_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_listings
    ADD CONSTRAINT food_listings_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 16462)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 16443)
-- Name: pickups pickups_listing_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pickups
    ADD CONSTRAINT pickups_listing_id_key UNIQUE (listing_id);


--
-- TOC entry 4763 (class 2606 OID 16441)
-- Name: pickups pickups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pickups
    ADD CONSTRAINT pickups_pkey PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 16410)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4757 (class 2606 OID 16408)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4766 (class 2606 OID 16427)
-- Name: food_listings food_listings_accepted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_listings
    ADD CONSTRAINT food_listings_accepted_by_fkey FOREIGN KEY (accepted_by) REFERENCES public.users(id);


--
-- TOC entry 4767 (class 2606 OID 16422)
-- Name: food_listings food_listings_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_listings
    ADD CONSTRAINT food_listings_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4770 (class 2606 OID 16468)
-- Name: notifications notifications_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.food_listings(id);


--
-- TOC entry 4771 (class 2606 OID 16463)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4768 (class 2606 OID 16444)
-- Name: pickups pickups_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pickups
    ADD CONSTRAINT pickups_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.food_listings(id) ON DELETE CASCADE;


--
-- TOC entry 4769 (class 2606 OID 16449)
-- Name: pickups pickups_ngo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pickups
    ADD CONSTRAINT pickups_ngo_id_fkey FOREIGN KEY (ngo_id) REFERENCES public.users(id);


-- Completed on 2026-03-05 19:21:41

--
-- PostgreSQL database dump complete
--

\unrestrict QywvX3V3w5XAlycUCjWmSQf8p72EndJ5NsZrBPzv5jSDLju63gPXgwXzSY0fYvp

