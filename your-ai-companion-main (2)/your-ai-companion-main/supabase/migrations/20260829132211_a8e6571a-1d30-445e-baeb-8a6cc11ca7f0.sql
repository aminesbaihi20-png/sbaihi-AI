CREATE TABLE public.universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  type text NOT NULL CHECK (type IN ('public', 'private')),
  field text NOT NULL CHECK (field IN ('general', 'engineering', 'medicine', 'business', 'technology')),
  website text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.universities TO anon;
GRANT SELECT ON public.universities TO authenticated;
GRANT ALL ON public.universities TO service_role;

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous and authenticated users to read universities"
ON public.universities
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.universities (name, city, type, field, website, description) VALUES
('Université Mohammed V de Rabat', 'Rabat', 'public', 'general', 'https://www.um5.ac.ma', 'One of Morocco’s largest public universities, known for medicine, sciences, law, and humanities.'),
('Université Cadi Ayyad', 'Marrakech', 'public', 'general', 'https://www.uca.ma', 'A major public university in Marrakech with strong science, medicine, and technology faculties.'),
('Université Hassan II de Casablanca', 'Casablanca', 'public', 'general', 'https://www.uh2c.ac.ma', 'Casablanca’s flagship public university, offering broad programs in sciences, medicine, and law.'),
('Université Mohammed Premier', 'Oujda', 'public', 'general', 'https://www.ump.ma', 'A leading public university in eastern Morocco with faculties in science, medicine, and humanities.'),
('Université Ibn Tofail', 'Kénitra', 'public', 'general', 'https://www.uit.ac.ma', 'Public university in Kénitra known for science, technology, and teacher training programs.'),
('Université Sidi Mohammed Ben Abdellah', 'Fès', 'public', 'general', 'https://www.usmba.ac.ma', 'Historic public university in Fès offering medicine, sciences, law, and economics.'),
('Université Abdelmalek Essaadi', 'Tétouan / Tanger', 'public', 'general', 'https://www.uae.ac.ma', 'Public university spanning northern Morocco, strong in science, medicine, and maritime studies.'),
('Université Ibn Zohr', 'Agadir', 'public', 'general', 'https://www.uiz.ac.ma', 'Public university in Agadir with programs in science, medicine, law, and humanities.'),
('Université Moulay Ismail', 'Meknès', 'public', 'general', 'https://www.umi.ac.ma', 'Public university in Meknès known for science, engineering, and agricultural studies.'),
('Université Chouaib Doukkali', 'El Jadida', 'public', 'general', 'https://www.ucd.ac.ma', 'Public university in El Jadida focused on science, education, and humanities.'),
('Université Sultan Moulay Slimane', 'Beni Mellal', 'public', 'general', 'https://www.usms.ac.ma', 'Public university in Beni Mellal offering science, technology, and humanities programs.'),
('Université Mohammed VI Polytechnique', 'Ben Guerir', 'public', 'technology', 'https://www.um6p.ma', 'A research-intensive university focused on science, engineering, agriculture, and innovation.'),
('Université Internationale de Rabat', 'Rabat', 'private', 'technology', 'https://www.uir.ac.ma', 'A private international university offering engineering, business, and computer science programs.'),
('Université Euro-Méditerranéenne de Fès', 'Fès', 'private', 'general', 'https://www.ueuromed.org', 'Private Euro-Mediterranean university with programs in engineering, business, and health.'),
('Université Privée de Fès', 'Fès', 'private', 'general', 'https://www.upf.ac.ma', 'Private university in Fès offering law, business, engineering, and health sciences.'),
('Université Privée de Marrakech', 'Marrakech', 'private', 'business', 'https://www.upm.ac.ma', 'Private university known for business, management, and tourism programs.'),
('Université Mundiapolis', 'Casablanca', 'private', 'business', 'https://www.mundiapolis.ma', 'Private university in Casablanca focused on business, engineering, and health sciences.'),
('Université Internationale de Casablanca', 'Casablanca', 'private', 'business', 'https://www.uic.ac.ma', 'Private university offering business, management, and international relations programs.'),
('Université Al Akhawayn', 'Ifrane', 'private', 'general', 'https://www.aui.ma', 'English-language private university in Ifrane, modeled on the American liberal arts tradition.'),
('HEM Business School', 'Casablanca', 'private', 'business', 'https://www.hem.ac.ma', 'Leading private business school with campuses across Morocco.'),
('ISCAE - Institut Supérieur de Commerce et d’Administration des Entreprises', 'Casablanca', 'public', 'business', 'https://www.iscae.ma', 'Prestigious public business and management school.'),
('INSEA - Institut National de Statistique et d’Économie Appliquée', 'Rabat', 'public', 'business', 'https://www.insea.ac.ma', 'Top public school for statistics, economics, and applied data science.'),
('ENSIAS - École Nationale Supérieure d’Informatique et d’Analyse des Systèmes', 'Rabat', 'public', 'technology', 'https://www.ensias.ma', 'Elite public engineering school specializing in computer science and systems analysis.'),
('EMI - École Mohammadia d’Ingénieurs', 'Rabat', 'public', 'engineering', 'https://www.emi.ac.ma', 'One of Morocco’s oldest and most prestigious engineering schools.'),
('EHTP - École Hassania des Travaux Publics', 'Casablanca', 'public', 'engineering', 'https://www.ehtp.ac.ma', 'Leading public engineering school for civil, environmental, and energy engineering.'),
('ENSAM - École Nationale Supérieure des Arts et Métiers', 'Meknès', 'public', 'engineering', 'https://www.ensam-umi.ac.ma', 'Public engineering school known for mechanical, industrial, and energy engineering.'),
('FST de Settat', 'Settat', 'public', 'technology', 'https://www.fsts.ac.ma', 'Faculty of Sciences and Techniques offering technology and science programs.'),
('FST de Mohammedia', 'Mohammedia', 'public', 'technology', 'https://www.fstm.ac.ma', 'Faculty of Sciences and Techniques near Casablanca.'),
('FST de Tanger', 'Tanger', 'public', 'technology', 'https://www.fstt.ac.ma', 'Faculty of Sciences and Techniques in Tangier.'),
('Faculté de Médecine et de Pharmacie de Casablanca', 'Casablanca', 'public', 'medicine', 'https://www.fmpc.ac.ma', 'Major public medical and pharmacy faculty in Casablanca.'),
('Faculté de Médecine et de Pharmacie de Rabat', 'Rabat', 'public', 'medicine', 'https://www.fmpr.ac.ma', 'Major public medical and pharmacy faculty in Rabat.'),
('Faculté de Médecine et de Pharmacie de Marrakech', 'Marrakech', 'public', 'medicine', 'https://www.fmpm.ac.ma', 'Major public medical and pharmacy faculty in Marrakech.'),
('Université Privée de Marrakech - Business School', 'Marrakech', 'private', 'business', 'https://www.upm.ac.ma', 'Business-focused programs at the Private University of Marrakech.');
