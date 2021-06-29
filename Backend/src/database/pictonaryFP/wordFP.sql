
-- se encarga de almacenar las pabras sin repetirlas 
CREATE OR REPLACE PROCEDURE public.add_word(
    _word character varying,
    _lang character varying,
    success BOOLEAN DEFAULT FALSE,
    id_new int DEFAULT null
) 
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    if(EXISTS(SELECT id FROM public.word WHERE word.word = _word AND word.lang = _lang))THEN
        return;
    END IF;

    INSERT INTO public.word 
        (word,lang)
    VALUES
        (_word,_lang) returning word.id into id_new;
    success = true;
END;
$BODY$;

-- se encarga de traer una X catidad de palabras segun el idioma
CREATE OR REPLACE FUNCTION public.get_word(
    _lang character varying,
    _size int
) 
RETURNS table(
    word    character varying
)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    RETURN QUERY 
    SELECT
        W.word
    FROM
        public.word W
    WHERE
        W.lang = _lang
    ORDER BY RANDOM()
    LIMIT _size;
END;
$BODY$;